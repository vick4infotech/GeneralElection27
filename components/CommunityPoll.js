'use client';
import {useEffect,useState} from 'react';
import {candidates} from '../lib/candidates';
import CandidatePortrait from './CandidatePortrait';
import PartyMark from './PartyMark';
import PollResults from './PollResults';

export default function CommunityPoll({initialSummary}){
 const [summary,setSummary]=useState(initialSummary);
 const [choice,setChoice]=useState('');
 const [email,setEmail]=useState('');
 const [code,setCode]=useState('');
 const [pollStatus,setPollStatus]=useState(null);
 const [myVote,setMyVote]=useState(null);
 const [phase,setPhase]=useState('choose');
 const [consent,setConsent]=useState(false);
 const [adultConfirmed,setAdultConfirmed]=useState(false);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [error,setError]=useState('');
 useEffect(()=>{
  let active=true;
  async function refresh(){
   try{
    const response=await fetch('/api/poll',{cache:'no-store',credentials:'same-origin'});
    const result=await response.json();
    if(active){setSummary(result);setMyVote(result.myVote||null);setPollStatus(result.pollStatus||null);}
   }catch{}finally{if(active)setLoading(false)}
  }
  refresh();const timer=setInterval(refresh,30000);
  return()=>{active=false;clearInterval(timer)};
 },[]);
 async function call(url,body,method='POST'){
  setBusy(true);setError('');setMessage('');
  try{
   const response=await fetch(url,{method,credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||'Something went wrong. Please try again.');
   if(result.summary)setSummary(result.summary);
   if(result.pollStatus!==undefined)setPollStatus(result.pollStatus);
   if(result.myVote!==undefined)setMyVote(result.myVote);
   if(result.message)setMessage(result.message);
   return result;
  }catch(err){setError(err.message);return null;}
  finally{setBusy(false)}
 }
 async function requestCode(event){
  event?.preventDefault();
  if(!choice||!consent||!adultConfirmed)return;
  const result=await call('/api/poll/email/start',{party:choice,email,privacyConsent:consent,adultConfirmed});
  if(result){setCode('');setPhase('verify');}
 }
 async function confirmCode(event){
  event.preventDefault();
  const result=await call('/api/poll/email/confirm',{email,code});
  if(result){setCode('');setPhase('choose');}
 }
 async function withdraw(){await call('/api/poll',{},'DELETE')}
 return <div className="poll-widget email-poll-widget">
  <div className="poll-guest-intro">
   <span className="section-eyebrow">EMAIL-VERIFIED COMMUNITY POLL</span>
   <h3>Who would you choose?</h3>
   <p>Choose a candidate, verify your email with a six-digit code, and see how other verified visitors responded. Verification is required before any response is counted; no password or account creation is needed.</p>
  </div>
  <div className="poll-disclaimer"><strong>Community responses, not official election results.</strong> This voluntary online poll is not nationally representative or a prediction. One response is permitted per verified email address, not necessarily one per person.</div>
  {summary?.status==='ok'&&<>
   {loading?<div className="auth-skeleton"><span className="spin"/> Checking poll status…</div>:
    pollStatus==='voted'&&myVote?<div className="voted-state" role="status">
     <div className="verified-check">✓</div>
     <strong>One verified response recorded</strong>
     <p>Your selection: <strong>{candidates.find(c=>c.abbr===myVote)?.name||myVote}</strong>. Your email cannot submit a second response, even from another browser.</p>
     <button type="button" className="btn btn-secondary" disabled={busy} onClick={withdraw}>{busy?'Removing…':'Withdraw my preference'}</button>
    </div>:
    pollStatus==='withdrawn'?<div className="voted-state" role="status">
     <div className="verified-check">✓</div>
     <strong>Your preference was withdrawn</strong>
     <p>Your response is no longer counted. To prevent repeat voting, this verified email cannot cast a second response.</p>
    </div>:
    phase==='verify'?<form className="poll-email-form poll-verify-form" onSubmit={confirmCode}>
     <div className="poll-otp-icon" aria-hidden="true">✉️</div>
     <h4>Check your email</h4>
     <p>We sent a six-digit verification code to <strong>{email}</strong>. The code expires after 10 minutes.</p>
     <label htmlFor="poll-otp">Six-digit verification code</label>
     <input id="poll-otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))}/>
     <button type="submit" className="btn btn-primary" disabled={busy||code.length!==6}>{busy?<><span className="spin"/> Verifying…</>:'VERIFY EMAIL & SUBMIT MY CHOICE →'}</button>
     <div className="poll-email-actions"><button type="button" className="text-button" disabled={busy} onClick={()=>{setPhase('choose');setError('');setMessage('')}}>Change email or candidate</button><button type="button" className="text-button" disabled={busy} onClick={()=>requestCode()}>Resend code</button></div>
    </form>:
    <form onSubmit={requestCode}>
     <div className="poll-choice-grid">{candidates.map(c=><label className={`poll-choice ${choice===c.abbr?'selected':''}`} key={c.abbr}><input type="radio" name="candidate" checked={choice===c.abbr} onChange={()=>setChoice(c.abbr)}/><CandidatePortrait candidate={c} size="small"/><PartyMark party={c} size="small"/><span><strong>{c.name}</strong><small>{c.abbr} · {c.party}</small></span></label>)}</div>
     <div className="poll-email-form">
      <label htmlFor="poll-email">Email address for your verification code</label>
      <input id="poll-email" type="email" autoComplete="email" required maxLength={254} placeholder="name@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
      <label className="check"><input type="checkbox" checked={adultConfirmed} onChange={e=>setAdultConfirmed(e.target.checked)}/> I am at least 18 years old.</label>
      <label className="check"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> I voluntarily consent to use my email for OTP verification and to record my candidate preference in this website's aggregate poll. <a href="/privacy">Privacy details</a>.</label>
      <button type="submit" className="btn btn-primary" disabled={busy||!choice||!email||!consent||!adultConfirmed}>{busy?<><span className="spin"/> Sending code…</>:'SEND MY EMAIL CODE →'}</button>
     </div>
    </form>}
   {message&&<p className="feedback" role="status">{message}</p>}
   {error&&<p className="feedback poll-error" role="alert">{error}</p>}
   <div className="section-heading poll-results-heading"><h3>Top 3 in the verified community poll</h3><span>Real, voluntary responses</span></div>
   <PollResults summary={summary} compact/>
   <details className="poll-all-results"><summary>See full candidate breakdown</summary><PollResults summary={summary}/></details>
  </>}
  {summary?.status==='not-configured'&&<div className="muted-card">Poll opening soon: database connection is not available.</div>}
  {summary?.status==='unavailable'&&<div className="muted-card">Poll is temporarily unavailable. Please check back.</div>}
 </div>;
}
