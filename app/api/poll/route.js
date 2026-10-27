import {NextResponse} from 'next/server';
import {getSummary,getPollEmailSession,withdrawPollEmail,requestOriginMatches} from '../../../lib/db';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store, max-age=0'};
const fail=(error,status)=>NextResponse.json({error},{status,headers});

export async function GET(req){
 const summary=await getSummary();
 let session=null;
 try{const token=req.cookies.get('ge27_poll_email')?.value;if(token)session=await getPollEmailSession(token);}catch{}
 const response=NextResponse.json({...summary,myVote:session?.party_abbr||null,pollStatus:session?(session.party_abbr?'voted':'withdrawn'):null},{headers});
 // Clean up obsolete anonymous poll cookies from browsers on the previous version.
 response.cookies.set('ge27_poll_guest','',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:0});
 return response;
}
export async function POST(){
 return fail('For the community poll, choose a candidate and verify your email using the six-digit code.',403);
}
export async function DELETE(req){
 if(!requestOriginMatches(req))return fail('Invalid request origin.',403);
 try{
  const token=req.cookies.get('ge27_poll_email')?.value;
  const session=token?await getPollEmailSession(token):null;
  if(!session)return fail('Verify your email again to access this response.',401);
  if(!session.party_abbr)return fail('This email has already withdrawn its response.',409);
  await withdrawPollEmail(session);
  return NextResponse.json({ok:true,myVote:null,pollStatus:'withdrawn',summary:await getSummary(),
   message:'Your candidate choice was removed from the tally. This email cannot submit a second response.'},{headers});
 }catch(err){console.error('Email poll withdrawal:',err?.message);return fail('Unable to withdraw your response right now.',503);}
}
