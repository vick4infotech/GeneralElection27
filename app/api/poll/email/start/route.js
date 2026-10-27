import crypto from 'node:crypto';
import {NextResponse} from 'next/server';
import {candidates} from '../../../../../lib/candidates';
import {ensure,pollEmailDigest,otpDigest,rateLimit,requestRateKey,requestOriginMatches} from '../../../../../lib/db';
import {normalizeEmail,validEmail,smtpReady,sendPollCode} from '../../../../../lib/auth';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const noStore={'Cache-Control':'no-store'};
const fail=(message,status)=>NextResponse.json({error:message},{status,headers:noStore});

export async function POST(req){
 if(!requestOriginMatches(req))return fail('Invalid request origin.',403);
 if(!smtpReady())return fail('Email verification is not configured. Contact the administrator.',503);
 try{
  const body=await req.json();
  const email=normalizeEmail(body?.email);
  const party=body?.party;
  if(!validEmail(email)||!candidates.some(c=>c.abbr===party)||body?.privacyConsent!==true||body?.adultConfirmed!==true){
   return fail('Select a candidate, enter a valid email and confirm the required consent.',400);
  }
  const emailHash=pollEmailDigest(email);
  if(!(await rateLimit('poll-email-request-ip:'+requestRateKey(req),15,3600)) ||
     !(await rateLimit('poll-email-request-address:'+emailHash,4,3600)))return fail('Too many code requests. Try later.',429);
  const con=await ensure();
  const code=String(crypto.randomInt(0,1000000)).padStart(6,'0');
  const codeHash=otpDigest(emailHash,code);
  const inserted=await con.query(`INSERT INTO poll_email_otps(email_hash,code_hash,party_abbr,expires_at,sent_at,attempts)
   VALUES($1,$2,$3,NOW()+INTERVAL '10 minutes',NOW(),0)
   ON CONFLICT(email_hash) DO UPDATE SET code_hash=$2,party_abbr=$3,
    expires_at=NOW()+INTERVAL '10 minutes',sent_at=NOW(),attempts=0
   WHERE poll_email_otps.sent_at<=NOW()-INTERVAL '60 seconds'
   RETURNING email_hash`,[emailHash,codeHash,party]);
  if(inserted.rowCount===0)return fail('Please wait 60 seconds before requesting another code.',429);
  try{await sendPollCode(email,code);}catch(err){
   // Only delete the code we attempted to send, not a newer replacement.
   await con.query('DELETE FROM poll_email_otps WHERE email_hash=$1 AND code_hash=$2',[emailHash,codeHash]);
   console.error('Poll SMTP delivery failure:',err?.code||err?.message);
   return fail('Unable to send a code. Check the verified Brevo sender and SMTP configuration.',503);
  }
  return NextResponse.json({ok:true,message:'Check your inbox for the six-digit code. It expires in 10 minutes.'},{headers:noStore});
 }catch(err){console.error('Poll email request:',err?.message);return fail('Verification temporarily unavailable.',503);}
}
