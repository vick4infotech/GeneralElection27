// Reported from INEC's final presidential nomination list, published 12 Sep 2026.
// Reconfirm with INEC before publication, especially substitutions/court decisions.
// https://www.bbc.com/pidgin/articles/ckgwky4q4gno
import {byAbbr} from './parties';
// Edit all candidate photographs centrally in data/candidate-photos.json.
// Prefer local photos added with scripts/set-candidate-photo.mjs.
// Other candidates show a Nigeria-flag illustration until a photo is provided.
import candidatePhotoSources from '../data/candidate-photos.json';
export const candidates = [
 {abbr:'AA',name:'Rufai Adekunle Omo-Aje',runningMate:'Shehu Hussaini'},
 {abbr:'ADP',name:'Abbas-Bin Aliyu',runningMate:'Ike Chinazam'},
 {abbr:'APP',name:'Yusuf Kabiru',runningMate:'Ofordile Peace Egobia'},
 {abbr:'AAC',name:'Omoyele Sowore',runningMate:'Magashi Haruna Garba'},
 {abbr:'ADC',name:'Atiku Abubakar',runningMate:'Rotimi Amaechi'},
 {abbr:'APC',name:'Bola Ahmed Tinubu',runningMate:'Kashim Shettima'},
 {abbr:'APM',name:'Oluseyi Abiodun Makinde',runningMate:'Musa Lawal Daura'},
 {abbr:'BP',name:'Sunday Adenuga',runningMate:'Mustapha Usman Turaki'},
 {abbr:'DLA',name:'Moses Olusoji Adebisi',runningMate:'Nafisat Usaku Abubakar'},
 {abbr:'LP',name:'Sunday Chibuzo Okereke',runningMate:'Hajja Bintu Konto'},
 {abbr:'NDP',name:'Ada Elizabeth Fredrick Okwori',runningMate:'Uchenna Anthony Chukwuemeka'},
 {abbr:'NRM',name:'Nkem Esther Okereke',runningMate:'Nasir Muhammed Sulaiman'},
 {abbr:'NDC',name:'Peter Gregory Obi',runningMate:'Rabiu Musa Kwankwaso'},
 {abbr:'PDP',name:'Sandy Ojang Onor',runningMate:'Umaru Babangida'},
 {abbr:'PRP',name:'Donald Duke',runningMate:'Kabiru Rabiu'},
 {abbr:'SDP',name:'Adewole Ebenezer Adebayo',runningMate:'Usman Muhammed Bugaje'},
 {abbr:'YPP',name:'Peter Ada Agada',runningMate:'Patience Ndidi Key'},
 {abbr:'ZLP',name:'Daniel Daberechukwu Nwanyanwu',runningMate:'Khalid Hassan'}
].map(c=>({...c,slug:c.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),party:byAbbr[c.abbr].name,logo:byAbbr[c.abbr].logo,portrait:candidatePhotoSources[c.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')]||null}));
export const candidatesBySlug=Object.fromEntries(candidates.map(c=>[c.slug,c]));
