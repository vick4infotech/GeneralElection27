'use client';
import {useState} from 'react';
export default function CandidatePortrait({candidate,size='medium'}){
 const [failed,setFailed]=useState(false);
 if(candidate.portrait&&!failed) return <img className={`candidate-photo ${size}`} loading="lazy" decoding="async" src={candidate.portrait} width={90} height={90} alt={`Portrait of ${candidate.name}`} onError={()=>setFailed(true)}/>;
 return <span className={`candidate-photo portrait-fallback ${size}`} role="img" aria-label={`Nigeria flag illustration: portrait of ${candidate.name} not yet licensed`}><img src="/nigeria-symbol.svg" alt="" loading="lazy"/></span>;
}
