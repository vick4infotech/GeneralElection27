import {NextResponse} from 'next/server';
import {bcrypt,ensure,issueCode,rateLimit,clientIp,validEmail,normalizeEmail,smtpReady} from '../../../../lib/auth';
export const runtime='nodejs';
export async function POST(req){try{const d=await req.json();const email=normalizeEmail(d.email), username=String(d.username||'').trim();const password=String(d.password||'');
 if(!smtpReady())return NextResponse.json({error:'Registration will open after email delivery is configured.'},{status:503});
 if(!validEmail(email)||!/^[a-zA-Z0-9_.-]{3,32}$/.test(username)||password.length<12||password.length>128||password!==d.confirmPassword||d.privacyConsent!==true||d.adultConfirmed!==true)return NextResponse.json({error:'Use a valid email and username, matching passwords of at least 12 characters, and confirm consent and age.'},{status:400});
 if(!(await rateLimit('register-ip:'+clientIp(req),12,3600))||!(await rateLimit('register-email:'+email,4,3600)))return NextResponse.json({error:'Too many requests. Try again later.'},{status:429});
 const con=await ensure();const old=await con.query('SELECT id,verified_at,otp_sent_at FROM poll_accounts WHERE email=$1 OR LOWER(username)=LOWER($2)',[email,username]);
 if(old.rowCount)return NextResponse.json({error:'This email or username is already in use. Log in or request a new verification code.'},{status:409});
 const hash=await bcrypt.hash(password,12);const r=await con.query(`INSERT INTO poll_accounts(username,email,password_hash,consent_at) VALUES($1,$2,$3,NOW()) RETURNING id`,[username,email,hash]);
 try{await issueCode(con,email,r.rows[0].id);}catch(e){console.error('SMTP register:',e.message);return NextResponse.json({error:'Account created, but email could not be delivered. Check SMTP configuration and retry verification.'},{status:503});}
 return NextResponse.json({ok:true,message:'A six-digit code has been sent to your email. It expires in 10 minutes.'});
 }catch(e){console.error('Register:',e.message);return NextResponse.json({error:'Registration is temporarily unavailable.'},{status:503});}}
