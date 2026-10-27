'use client';
import {useState} from 'react';
// CC BY-SA 3.0 Nigeria coat-of-arms artwork (Lumia1234), see /credits.
// Fall back to our locally hosted flag-inspired icon when remote media is unavailable.
export default function NigeriaInsignia({className='',coatOfArms=false,alt='Flag-inspired Nigerian national symbol'}){
 const [error,setError]=useState(false);
 const actual=coatOfArms&&!error;
 return <img className={className} src={actual?'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Coat_of_arms_of_Nigeria.svg/500px-Coat_of_arms_of_Nigeria.svg.png':'/nigeria-symbol.svg'} width={120} height={120} loading="lazy" decoding="async" alt={actual?'Coat of arms of Nigeria':alt} onError={()=>setError(true)}/>;
}
