import crypto from 'node:crypto';
import {NextResponse} from 'next/server';
import {ensure,pollEmailDigest,pollEmailSessionDigest,otpDigest,createGuestToken,pollEmailCookieOptions,rateLimit,requestRateKey,requestOriginMatches,getSummary} from '../../../../../lib/db';
import {normalizeEmail,validEmail} from '../../../../../lib/auth';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
const fail=(message,status)=>NextResponse.json({error:message},{status,headers});

export async function POST(req){
 if(!requestOriginMatches(req))return fail('Invalid request origin.',403);
 let con,locked=false;
 try{
  const body=await req.json();
  const email=normalizeEmail(body?.email),code=String(body?.code||'');
  if(!validEmail(email)||!/^\d{6}$/.test(code))return fail('Enter a valid email and six-digit verification code.',400);
  const emailHash=pollEmailDigest(email);
  if(!(await rateLimit('poll-confirm-ip:'+requestRateKey(req),35,3600)) ||
     !(await rateLimit('poll-confirm-address:'+emailHash,15,3600)))return fail('Too many verification attempts. Try later.',429);
  const pool=await ensure();con=await pool.connect();
  await con.query('BEGIN');locked=true;
  const found=await con.query('SELECT code_hash,party_abbr,expires_at,attempts FROM poll_email_otps WHERE email_hash=$1 FOR UPDATE',[emailHash]);
  const record=found.rows[0];
  if(!record||record.attempts>=5||new Date(record.expires_at)<=new Date()){
   await con.query('ROLLBACK');locked=false;
   return fail('Invalid or expired code. Request a new one.',400);
  }
  const supplied=otpDigest(emailHash,code);
  if(!crypto.timingSafeEqual(Buffer.from(supplied,'hex'),Buffer.from(record.code_hash,'hex'))){
   await con.query('UPDATE poll_email_otps SET attempts=attempts+1 WHERE email_hash=$1',[emailHash]);
   await con.query('COMMIT');locked=false;
   return fail('Incorrect code. Check the email and try again.',400);
  }
  // Atomic INSERT + email_hash primary key => same verified email never casts a second response.
  const added=await con.query(`INSERT INTO community_poll_email(email_hash,party_abbr,consent_at)
   VALUES($1,$2,NOW()) ON CONFLICT(email_hash) DO NOTHING RETURNING email_hash`,[emailHash,record.party_abbr]);
  const responseRow=await con.query('SELECT party_abbr,withdrawn_at FROM community_poll_email WHERE email_hash=$1',[emailHash]);
  const sessionToken=createGuestToken();
  await con.query(`INSERT INTO poll_email_sessions(token_hash,email_hash,expires_at)
   VALUES($1,$2,NOW()+INTERVAL '30 days')`,[pollEmailSessionDigest(sessionToken),emailHash]);
  await con.query('DELETE FROM poll_email_otps WHERE email_hash=$1',[emailHash]);
  await con.query('COMMIT');locked=false;
  const myVote=responseRow.rows[0]?.party_abbr||null;
  const res=NextResponse.json({ok:true,accepted:added.rowCount===1,myVote,
   pollStatus:myVote?'voted':'withdrawn',
   message:added.rowCount===1?'Your email is verified and your poll response is recorded.':myVote?'This email has already participated. We have restored access to your existing response.':'This email previously withdrew its response and cannot submit a second one.',
   summary:await getSummary()},{headers});
  res.cookies.set('ge27_poll_email',sessionToken,pollEmailCookieOptions());
  // Expire obsolete browser-cookie guest vote; it is excluded from the new verified tally.
  res.cookies.set('ge27_poll_guest','',{...pollEmailCookieOptions(),maxAge:0});
  return res;
 }catch(err){if(locked&&con)await con.query('ROLLBACK').catch(()=>{});
  console.error('Poll email confirmation:',err?.message);return fail('Unable to verify email right now.',503);
 }finally{if(con)con.release();}
}
