import pg from 'pg';
import crypto from 'node:crypto';
import {candidates} from './candidates';
let pool, ready;
function db(){if(!process.env.DATABASE_URL)return null;if(!pool)pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:8,connectionTimeoutMillis:5000,ssl:process.env.DATABASE_SSL==='true'?{rejectUnauthorized:true}:undefined});return pool;}
export async function ensure(){const con=db();if(!con)throw Error('Database is not configured');if(!ready)ready=con.query(`CREATE TABLE IF NOT EXISTS poll_accounts (
 id BIGSERIAL PRIMARY KEY, username VARCHAR(45) UNIQUE NOT NULL, email VARCHAR(320) UNIQUE NOT NULL,
 password_hash TEXT NOT NULL, verified_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 otp_hash CHAR(64), otp_expires TIMESTAMPTZ, otp_sent_at TIMESTAMPTZ,
 otp_attempts INT NOT NULL DEFAULT 0, consent_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS community_poll_verified (
 account_id BIGINT PRIMARY KEY REFERENCES poll_accounts(id) ON DELETE CASCADE,
 party_abbr VARCHAR(8) NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS poll_auth_limits (
 bucket CHAR(64) PRIMARY KEY, attempts INT NOT NULL DEFAULT 0, window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS community_poll_verified_party_idx ON community_poll_verified(party_abbr);
ALTER TABLE poll_accounts ALTER COLUMN email DROP NOT NULL;
ALTER TABLE poll_accounts ALTER COLUMN password_hash DROP NOT NULL;
CREATE TABLE IF NOT EXISTS facebook_connections (
 facebook_id VARCHAR(128) PRIMARY KEY,
 account_id BIGINT UNIQUE NOT NULL REFERENCES poll_accounts(id) ON DELETE CASCADE,
 display_name VARCHAR(100) NOT NULL,
 avatar_url TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Email-only poll: raw email is never stored with political preferences.
CREATE TABLE IF NOT EXISTS poll_email_otps (
 email_hash CHAR(64) PRIMARY KEY,
 code_hash CHAR(64) NOT NULL,
 party_abbr VARCHAR(8) NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL,
 sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 attempts INT NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS community_poll_email (
 email_hash CHAR(64) PRIMARY KEY,
 party_abbr VARCHAR(8),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 withdrawn_at TIMESTAMPTZ,
 consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS community_poll_email_party_idx ON community_poll_email(party_abbr) WHERE party_abbr IS NOT NULL;
CREATE TABLE IF NOT EXISTS poll_email_sessions (
 token_hash CHAR(64) PRIMARY KEY,
 email_hash CHAR(64) NOT NULL REFERENCES community_poll_email(email_hash) ON DELETE CASCADE,
 expires_at TIMESTAMPTZ NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS poll_email_sessions_expires_idx ON poll_email_sessions(expires_at);

CREATE TABLE IF NOT EXISTS guest_game_scores (
 token_hash CHAR(64) NOT NULL,
 mode VARCHAR(12) NOT NULL,
 week_key VARCHAR(10) NOT NULL,
 best_score INT NOT NULL,
 completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 PRIMARY KEY (token_hash,mode,week_key)
);
CREATE INDEX IF NOT EXISTS guest_game_scores_rank_idx ON guest_game_scores(mode,week_key,best_score DESC);
CREATE TABLE IF NOT EXISTS game_progress (
 account_id BIGINT PRIMARY KEY REFERENCES poll_accounts(id) ON DELETE CASCADE,
 state JSONB NOT NULL,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS game_scores (
 account_id BIGINT REFERENCES poll_accounts(id) ON DELETE CASCADE,
 mode VARCHAR(12) NOT NULL,
 week_key VARCHAR(10) NOT NULL,
 best_score INT NOT NULL,
 completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 PRIMARY KEY (account_id,mode,week_key)
);
CREATE INDEX IF NOT EXISTS game_scores_mode_week_rank_idx ON game_scores(mode,week_key,best_score DESC);
-- Remove historical anonymous poll responses permanently. Guest GAME tables remain untouched.
DROP TABLE IF EXISTS community_poll_guest;
`).catch(e=>{ready=null;throw e});await ready;return con;}
function hmac(value,secretName='AUTH_SECRET'){const key=process.env[secretName];if(!key||key.length<32)throw Error(secretName+' must contain at least 32 characters');return crypto.createHmac('sha256',key).update(value).digest('hex');}
export const otpDigest=(email,code)=>hmac('otp:'+email+':'+code);
export function gameGuestDigest(token){return hmac('game-guest:'+token,'AUTH_SECRET');}
export function createGuestToken(){return crypto.randomBytes(32).toString('hex');}
export function validGuestToken(token){return typeof token==='string'&&/^[a-f0-9]{64}$/.test(token);}
export function requestOriginMatches(req){
 try{
  const origin=req.headers.get('origin');
  const site=req.headers.get('sec-fetch-site');
  if(site==='cross-site')return false;
  if(!origin)return !site || ['same-origin','same-site','none'].includes(site);
  const host=req.headers.get('x-forwarded-host')||req.headers.get('host')||new URL(req.url).host;
  return new URL(origin).host===host;
 }catch{return false;}
}
export function guestCookieOptions(){return {httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:180*86400};}
export function requestRateKey(req){
 // Used only for throttling; the address is HMACed by rateLimit and not exposed.
 const candidate=req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for')||'').split(',')[0].trim();
 return candidate && candidate.length<120 ? candidate : 'unidentified';
}

export function cookieToken(userId){const issued=Date.now();const payload=`${userId}.${issued}`;return payload+'.'+hmac('session:'+payload);}
export function verifyCookie(cookie){if(typeof cookie!=='string')return null;const m=/^(\d+)\.(\d{13})\.([a-f0-9]{64})$/.exec(cookie);if(!m)return null;const payload=m[1]+'.'+m[2];const wanted=hmac('session:'+payload);if(!crypto.timingSafeEqual(Buffer.from(wanted),Buffer.from(m[3])))return null;if(Date.now()-Number(m[2])>30*86400000||Date.now()<Number(m[2]))return null;return Number(m[1]);}
export async function userFromRequest(request){try{const cookie=request.cookies.get('ge27_session')?.value;const id=verifyCookie(cookie);if(!id)return null;const con=await ensure();const r=await con.query('SELECT id,username,email,verified_at FROM poll_accounts WHERE id=$1',[id]);return r.rows[0]?.verified_at?r.rows[0]:null;}catch{return null;}}
export async function rateLimit(bucket,limit,seconds){const con=await ensure();const digest=hmac('rate:'+bucket);const r=await con.query(`INSERT INTO poll_auth_limits (bucket,attempts,window_start) VALUES ($1,1,NOW())
 ON CONFLICT (bucket) DO UPDATE SET attempts=CASE WHEN poll_auth_limits.window_start < NOW()-($2 * INTERVAL '1 second') THEN 1 ELSE poll_auth_limits.attempts+1 END,
 window_start=CASE WHEN poll_auth_limits.window_start < NOW()-($2 * INTERVAL '1 second') THEN NOW() ELSE poll_auth_limits.window_start END
 RETURNING attempts`,[digest,seconds]);return r.rows[0].attempts<=limit;}
export async function getSummary(){
 try{
  const con=await ensure();
  // Count only poll responses confirmed through email OTP.
  const r=await con.query(`SELECT party_abbr,COUNT(*)::int AS votes FROM community_poll_email WHERE party_abbr IS NOT NULL GROUP BY party_abbr`);
  const counts=Object.fromEntries(r.rows.map(x=>[x.party_abbr,x.votes]));
  const total=Object.values(counts).reduce((a,b)=>a+b,0);
  return {status:'ok',total,updatedAt:new Date().toISOString(),rows:candidates.map(c=>({...c,votes:counts[c.abbr]||0,percent:total?100*(counts[c.abbr]||0)/total:0})).sort((a,b)=>b.votes-a.votes||a.name.localeCompare(b.name))};
 }catch(e){
  if(!process.env.DATABASE_URL)return {status:'not-configured',total:0,rows:[]};
  console.error('Poll summary:',e.message);return {status:'unavailable',total:0,rows:[]};
 }
}
export async function recordVote(userId,party){const con=await ensure();const r=await con.query('INSERT INTO community_poll_verified (account_id,party_abbr) VALUES ($1,$2) ON CONFLICT (account_id) DO NOTHING RETURNING account_id',[userId,party]);return r.rowCount===1;}
export async function getMyVote(userId){const con=await ensure();const r=await con.query('SELECT party_abbr FROM community_poll_verified WHERE account_id=$1',[userId]);return r.rows[0]?.party_abbr||null;}
export async function removeVote(userId){const con=await ensure();await con.query('DELETE FROM community_poll_verified WHERE account_id=$1',[userId]);}

// Game sessions include a verified email account OR a Facebook-connected game account.
// Only userFromRequest() above authorises sensitive political poll submissions.
export async function gameUserFromRequest(request){
 try{
  const cookie=request.cookies.get('ge27_session')?.value;const id=verifyCookie(cookie);if(!id)return null;
  const con=await ensure();
  const result=await con.query(`SELECT p.id,p.username,p.email,p.verified_at,
    f.facebook_id,f.display_name,f.avatar_url
    FROM poll_accounts p LEFT JOIN facebook_connections f ON f.account_id=p.id
    WHERE p.id=$1`,[id]);
  const account=result.rows[0];
  if(!account||(!account.verified_at&&!account.facebook_id))return null;
  return {id:account.id,username:account.username,name:account.display_name||account.username,
   avatar:account.avatar_url||null,verifiedEmail:!!account.verified_at,facebook:!!account.facebook_id,
   email:account.email||null};
 }catch{return null}
}

// Stable, keyed email digest: protects raw email in the poll database.
// Changing POLL_HASH_SECRET will break recognition of existing responses.
export function pollEmailDigest(email){return hmac('poll-email:'+email,'POLL_HASH_SECRET');}
export function pollEmailSessionDigest(token){return hmac('poll-email-session:'+token,'POLL_HASH_SECRET');}
export async function getPollEmailSession(token){
 if(!validGuestToken(token))return null;
 const con=await ensure();
 const result=await con.query(`SELECT p.party_abbr,p.withdrawn_at,p.email_hash FROM poll_email_sessions s
 JOIN community_poll_email p ON p.email_hash=s.email_hash
 WHERE s.token_hash=$1 AND s.expires_at>NOW()`,[pollEmailSessionDigest(token)]);
 return result.rows[0]||null;
}
export async function withdrawPollEmail(session){
 const con=await ensure();
 const result=await con.query(`UPDATE community_poll_email SET party_abbr=NULL,withdrawn_at=NOW()
 WHERE email_hash=$1 AND party_abbr IS NOT NULL RETURNING email_hash`,[session.email_hash]);
 return result.rowCount===1;
}
export function pollEmailCookieOptions(){return {httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:30*86400};}
