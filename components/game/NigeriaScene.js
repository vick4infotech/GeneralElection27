'use client';
import {useState} from 'react';
// Decorative simplified SVG map. Locations are illustrative game hotspots, not GIS data.
const places=[
 {name:'Kano',x:176,y:91,topic:'🛒 Markets'},
 {name:'Abuja',x:151,y:169,topic:'🏛️ Capital'},
 {name:'Lagos',x:62,y:236,topic:'🚍 Transport'},
 {name:'Enugu',x:201,y:239,topic:'🏥 Healthcare'},
 {name:'Borno',x:249,y:77,topic:'🛡️ Safety'},
 {name:'Rivers',x:160,y:274,topic:'⚡ Infrastructure'}
];
export default function NigeriaScene({activeRegion='Abuja',mini=false}){
 const [selected,setSelected]=useState(null);
 return <div className={`naija-world ${mini?'naija-world-mini':''}`}>
  <div className="world-sun"/><span className="world-cloud cloud-a"/><span className="world-cloud cloud-b"/>
  <div className="world-info"><span className="world-live-dot"/> THE NATION AT A GLANCE</div>
  <svg viewBox="0 0 360 335" className="nigeria-map-svg" role="img" aria-label="Stylised outline of Nigeria with interactive fictional challenge locations">
   <defs><linearGradient id="ng-glow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#64e4c5"/><stop offset="1" stopColor="#159378"/></linearGradient>
   <pattern id="ng-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1" fill="#adebd6" opacity=".22"/></pattern>
   <filter id="map-shadow"><feDropShadow dx="0" dy="15" stdDeviation="13" floodColor="#001b2d" floodOpacity=".55"/></filter></defs>
   <path d="M40 104 L65 93 78 72 113 78 129 61 156 69 174 52 209 58 237 52 261 64 275 46 302 71 308 110 322 121 304 156 289 168 292 190 269 201 269 227 244 227 232 249 211 255 195 280 170 290 154 278 134 285 123 267 96 259 81 239 63 237 56 210 38 193 46 164 31 142Z" fill="url(#ng-glow)" stroke="#d5fff2" strokeOpacity=".75" strokeWidth="2.5" filter="url(#map-shadow)"/>
   <path d="M40 104 L65 93 78 72 113 78 129 61 156 69 174 52 209 58 237 52 261 64 275 46 302 71 308 110 322 121 304 156 289 168 292 190 269 201 269 227 244 227 232 249 211 255 195 280 170 290 154 278 134 285 123 267 96 259 81 239 63 237 56 210 38 193 46 164 31 142Z" fill="url(#ng-dots)" opacity=".85"/>
   <path d="M115 85 Q146 155 108 240 M217 69 Q170 159 209 253 M47 182 Q176 132 304 158 M86 232 Q188 207 269 205" fill="none" stroke="#0a705f" strokeWidth="1.8" strokeOpacity=".5" strokeDasharray="5 9"/>
   {places.map((p,i)=><g key={p.name} tabIndex={0} role="button" aria-label={`Inspect ${p.name} illustration`} onClick={()=>setSelected(p)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(p)}}} className={`map-hotspot ${selected?.name===p.name||activeRegion.toLowerCase()===p.name.toLowerCase()?'active':''}`}>
     <circle cx={p.x} cy={p.y} r="16" fill="#e3fff5" opacity=".13" className="map-pulse" style={{animationDelay:`${i*200}ms`}}/>
     <circle cx={p.x} cy={p.y} r="6.5" fill="#fff4b2" stroke="#076b58" strokeWidth="2.5"/>
     <text x={p.x+8} y={p.y-10} fill="#ffffff" fontSize="12" fontWeight="800" paintOrder="stroke" stroke="#063f37" strokeWidth="3">{p.name}</text>
   </g>)}
  </svg>
  <div className="world-caption">{selected?`${selected.name} · ${selected.topic}`:`${activeRegion} · Country simulation`}</div>
  <div className="world-pill pill-one">⚡ POWER</div><div className="world-pill pill-two">🏥 HEALTH</div>
  <span className="world-note">Illustrative map • Fictional events</span>
 </div>
}
