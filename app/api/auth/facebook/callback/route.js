import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {ensure,gameUserFromRequest} from '../../../../../lib/db';
import {setSession} from '../../../../../lib/auth';
export const runtime='nodejs';
const landing=(req,code)=>new URL('/games?facebook='+encodeURIComponent(code),process.env.NEXT_PUBLIC_SITE_URL||req.url);
function done(req,code,id){const res=NextResponse.redirect(landing(req,code));
 res.cookies.delete('ge27_fb_state');res.cookies.delete('ge27_fb_link');if(id)setSession(res,id);return res;}
export async function GET(req){
 const args=new URL(req.url).searchParams,state=args.get('state')||'',cookie=req.cookies.get('ge27_fb_state')?.value||'';
 if(!state||!cookie||state.length!==cookie.length||!crypto.timingSafeEqual(Buffer.from(state),Buffer.from(cookie)))return done(req,'state-error');
 if(args.get('error'))return done(req,'cancelled');
 const code=args.get('code');if(!code)return done(req,'cancelled');
 const appId=process.env.FACEBOOK_APP_ID,secret=process.env.FACEBOOK_APP_SECRET,redirect=process.env.FACEBOOK_REDIRECT_URI;
 if(!appId||!secret||!redirect)return done(req,'not-configured');
 try{
  const version=process.env.FACEBOOK_GRAPH_VERSION||'v24.0';
  const tokenUrl=new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
  tokenUrl.searchParams.set('client_id',appId);tokenUrl.searchParams.set('client_secret',secret);
  tokenUrl.searchParams.set('redirect_uri',redirect);tokenUrl.searchParams.set('code',code);
  const tokenResp=await fetch(tokenUrl,{cache:'no-store',signal:AbortSignal.timeout(12000)});
  const token=await tokenResp.json();if(!tokenResp.ok||!token.access_token)throw Error('Token exchange rejected');
  const profileUrl=new URL(`https://graph.facebook.com/${version}/me`);
  profileUrl.searchParams.set('fields','id,name');profileUrl.searchParams.set('access_token',token.access_token);
  const profileResp=await fetch(profileUrl,{cache:'no-store',signal:AbortSignal.timeout(12000)});
  const profile=await profileResp.json();if(!profileResp.ok||!/^\d{3,32}$/.test(String(profile.id)))throw Error('Profile fetch rejected');
  const con=await ensure();const facebookId=String(profile.id),displayName=String(profile.name||'Facebook player').slice(0,100);
  const linked=await con.query('SELECT account_id FROM facebook_connections WHERE facebook_id=$1',[facebookId]);
  const wantsLink=req.cookies.get('ge27_fb_link')?.value==='1';
  const signedUser=wantsLink?await gameUserFromRequest(req):null;
  if(linked.rows[0]){if(signedUser&&Number(linked.rows[0].account_id)!==Number(signedUser.id))return done(req,'already-linked');return done(req,'connected',linked.rows[0].account_id);}
  const client=await con.connect();let accountId;
  try{
   await client.query('BEGIN');
   if(signedUser){accountId=signedUser.id;const other=await client.query('SELECT facebook_id FROM facebook_connections WHERE account_id=$1',[accountId]);if(other.rowCount)throw Error('This account already has a Facebook connection');}
   else{
    const username='fb_'+crypto.randomBytes(9).toString('hex');
    const row=await client.query('INSERT INTO poll_accounts(username,email,password_hash) VALUES($1,NULL,NULL) RETURNING id',[username]);accountId=row.rows[0].id;
   }
   await client.query('INSERT INTO facebook_connections(facebook_id,account_id,display_name) VALUES($1,$2,$3)',[facebookId,accountId,displayName]);
   await client.query('COMMIT');
  }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
  return done(req,'connected',accountId);
 }catch(e){console.error('Facebook OAuth callback:',e.message);return done(req,'failed');}
}
