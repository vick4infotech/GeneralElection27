import {NextResponse} from 'next/server';
import {gameUserFromRequest,ensure,rateLimit} from '../../../../../lib/db';
import {clientIp,normalizeEmail,validEmail,issueCode,smtpReady} from '../../../../../lib/auth';
export const runtime='nodejs';
export async function POST(req){
 const user=await gameUserFromRequest(req);
 if(!user?.facebook)return NextResponse.json({error:'Connect your Facebook account first.'},{status:401});
 if(user.verifiedEmail)return NextResponse.json({error:'Your email is already verified.'},{status:400});
 if(!smtpReady())return NextResponse.json({error:'Email delivery is not configured.'},{status:503});
 try{
  const data=await req.json();const email=normalizeEmail(data.email);
  if(!validEmail(email)||data.adultConfirmed!==true||data.privacyConsent!==true)return NextResponse.json({error:'Enter a valid email and confirm your age and privacy preferences.'},{status:400});
  if(!(await rateLimit('fb-email-ip:'+clientIp(req),15,3600))||!(await rateLimit('fb-email-user:'+user.id,5,3600)))return NextResponse.json({error:'Too many verification requests.'},{status:429});
  const con=await ensure();const taken=await con.query('SELECT id FROM poll_accounts WHERE email=$1 AND id<>$2',[email,user.id]);
  if(taken.rowCount)return NextResponse.json({error:'This email already belongs to an account. Sign into that account instead.'},{status:409});
  await con.query('UPDATE poll_accounts SET email=$1,otp_hash=NULL,otp_expires=NULL WHERE id=$2 AND verified_at IS NULL',[email,user.id]);
  await issueCode(con,email,user.id);
  return NextResponse.json({ok:true,message:'Your six-digit email verification code has been sent.'});
 }catch(e){console.error('Facebook email verification start:',e.message);return NextResponse.json({error:'Could not send verification email. Check SMTP settings.'},{status:503});}
}
