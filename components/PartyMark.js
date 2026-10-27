'use client';
import {useState} from 'react';
export default function PartyMark({party,size='medium'}){
 const [failed,setFailed]=useState(false);
 if(party.logo&&!failed)return <img className={`party-mark ${size}`} loading="lazy" decoding="async" src={party.logo} alt={`${party.name} logo`} width={48} height={48} onError={()=>setFailed(true)}/>;
 return <span className={`party-mark party-fallback ${size}`} role="img" aria-label={`Nigerian national flag placeholder: ${party.name} logo unavailable`}><img src="/nigeria-flag.svg" alt="" loading="lazy"/></span>;
}
