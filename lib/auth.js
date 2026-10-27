import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import {cookieToken, ensure, otpDigest, rateLimit} from './db';
export {bcrypt,crypto,ensure,otpDigest,rateLimit};
export const sessionCookie={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*30};
export function setSession(response,userId){response.cookies.set('ge27_session',cookieToken(userId),sessionCookie);}
export function clientIp(req){return (req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim().slice(0,100);}
export const validEmail=email=>typeof email==='string'&&email.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const normalizeEmail=email=>String(email||'').trim().toLowerCase();
export function smtpReady(){return !!(process.env.SMTP_HOST&&process.env.SMTP_PORT&&process.env.SMTP_USER&&process.env.SMTP_PASS&&process.env.SMTP_FROM);}
export async function sendCode(email,code){if(!smtpReady())throw Error('SMTP is not configured');const port=Number(process.env.SMTP_PORT);const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},requireTLS:port!==465,tls:{minVersion:'TLSv1.2'},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});await transport.sendMail({from:process.env.SMTP_FROM,to:email,subject:'Verify your General Election 2027 account',text:`Your one-time verification code is ${code}. It expires in 10 minutes. Do not share it. If you did not register, ignore this email.`,html:`<div style="font:16px Arial,sans-serif;max-width:520px;padding:25px"><p>General Election 2027</p><h2>Verify your email</h2><p>Enter this one-time code to finish registering:</p><p style="font-size:35px;letter-spacing:7px;font-weight:bold">${code}</p><p>Expires in 10 minutes. Never share the code.</p></div>`});}
export async function issueCode(con,email,id){const code=String(crypto.randomInt(0,1000000)).padStart(6,'0');await con.query(`UPDATE poll_accounts SET otp_hash=$1,otp_expires=NOW()+INTERVAL '10 minutes',otp_sent_at=NOW(),otp_attempts=0 WHERE id=$2`,[otpDigest(email,code),id]);await sendCode(email,code);}

// Brevo SMTP: uses SMTP_PASS (SMTP key), not the separate Brevo REST API key.
export async function sendPollCode(email,code){
 if(!smtpReady())throw Error('SMTP is not configured');
 const port=Number(process.env.SMTP_PORT);
 const transport=nodemailer.createTransport({
  host:process.env.SMTP_HOST,port,secure:port===465,
  auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},
  requireTLS:port!==465,tls:{minVersion:'TLSv1.2'},
  connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000
 });
 await transport.sendMail({
  from:process.env.SMTP_FROM,to:email,
  subject:'Your General Election 2027 poll verification code',
  text:`Your one-time poll verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email. Never share the code.`,
  html:`<div style="max-width:520px;margin:auto;padding:30px;font-family:Arial,sans-serif;color:#153c32"><p style="font-size:12px;letter-spacing:2px;color:#16805c">GENERAL ELECTION 2027</p><h2>Confirm your community poll choice</h2><p>Use this six-digit code to confirm your email address and submit your voluntary poll response:</p><div style="font-size:34px;font-weight:800;letter-spacing:8px;padding:20px;background:#f0f9f3;border-radius:12px;text-align:center">${code}</div><p>Expires in 10 minutes. If you didn't request it, ignore this message.</p></div>`
 });
}
