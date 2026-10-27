import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {gameUserFromRequest,ensure,rateLimit,otpDigest} from '../../../../../lib/db';
import {clientIp} from '../../../../../lib/auth';
export const runtime='nodejs';
export async function POST(req){
 const user=await gameUserFromRequest(req);if(!user?.facebook)return NextResponse.json({error:'Sign in with Facebook first.'},{status:401});
 try{const data=await req.json(),code=String(data.code||'');if(!/^\d{6}$/.test(code))return NextResponse.json({error:'Enter a six-digit code.'},{status:400});
 if(!(await rateLimit('fb-verify:'+clientIp(req),25,3600)))return NextResponse.json({error:'Too many attempts.'},{status:429});
 const con=await ensure();const r=await con.query('SELECT email,otp_hash,otp_expires,otp_attempts,verified_at FROM poll_accounts WHERE id=$1',[user.id]);const a=r.rows[0];
 const expected=a?.email?otpDigest(a.email,code):'';
 const matched=!!a?.otp_hash&&expected.length===a.otp_hash.length&&crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(a.otp_hash));
 if(!a||a.verified_at||!matched||a.otp_attempts>=5||new Date(a.otp_expires)<new Date()){
  if(a&&!a.verified_at)await con.query('UPDATE poll_accounts SET otp_attempts=otp_attempts+1 WHERE id=$1',[user.id]);
  return NextResponse.json({error:'Invalid or expired code. Please request a fresh one.'},{status:400});}
 await con.query('UPDATE poll_accounts SET verified_at=NOW(),otp_hash=NULL,otp_expires=NULL WHERE id=$1',[user.id]);
 return NextResponse.json({ok:true,message:'Email verified. You can now participate in the community poll.'});
 }catch(e){console.error('FB verify:',e.message);return NextResponse.json({error:'Verification is temporarily unavailable.'},{status:503});}
}
