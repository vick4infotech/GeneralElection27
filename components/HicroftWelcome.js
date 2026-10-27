'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';

// Non-blocking, accessible welcome card: shown once per browsing session.
// Importantly, the primary page remains readable for visitors and crawlers.
export default function HicroftWelcome(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{
  try {
   if(sessionStorage.getItem('hicroft-visit-v1'))return;
   sessionStorage.setItem('hicroft-visit-v1','1');
  }catch(_error){}
  setVisible(true);
  const timeout=setTimeout(()=>setVisible(false),8500);
  return ()=>clearTimeout(timeout);
 },[]);
 if(!visible)return null;
 return <aside className="hicroft-welcome" aria-label="Hicroft Technology welcome message">
  <button className="hicroft-close" type="button" aria-label="Dismiss welcome message" onClick={()=>setVisible(false)}>×</button>
  <img src="/hicroft-technology.webp" width="150" height="140" alt="Hicroft Technology logo"/>
  <div className="hicroft-welcome-copy"><span className="eyebrow">WELCOME TO GENERAL ELECTION 2027</span><strong>Powered by Hicroft Technology</strong><p>Advertise or discuss a campaign on the platform.</p><Link href="/advertise" onClick={()=>setVisible(false)}>Contact Hicroft ↗</Link></div>
 </aside>;
}
