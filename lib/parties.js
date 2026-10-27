// INEC party register checked 26 October 2026: https://www.inecnigeria.org/parties
// Party logos: put properly licensed/verified files in public/logos/ and set logo fields.
// Do not represent any person as a confirmed candidate without source verification.
// Visuals originate from image search results; see IMAGE-SOURCES.md for attribution and rights checks.
// Remote images are provisional: download/host authorized copies before production.
const partyImage={
 APC:'https://vote.apc.com.ng/Media/logo/apc-logo-300x270-2.png',
 NNPP:'https://nnpp.net.ng/register/wp-content/uploads/2023/09/NNPP_LOGO-removebg-preview-1.png'
};
export const parties = [
  {abbr:'A',name:'Accord'},
  {abbr:'AA',name:'Action Alliance'},
  {abbr:'AAC',name:'African Action Congress'},
  {abbr:'ADC',name:'African Democratic Congress'},
  {abbr:'ADP',name:'Action Democratic Party'},
  {abbr:'APC',name:'All Progressives Congress'},
  {abbr:'APGA',name:'All Progressives Grand Alliance'},
  {abbr:'APM',name:'Allied Peoples Movement'},
  {abbr:'APP',name:'Action Peoples Party'},
  {abbr:'BP',name:'Boot Party'},
  {abbr:'DLA',name:'Democratic Leadership Alliance'},
  {abbr:'LP',name:'Labour Party'},
  {abbr:'NDC',name:'Nigeria Democratic Congress'},
  {abbr:'NDP',name:'National Democratic Party'},
  {abbr:'NNPP',name:'New Nigeria Peoples Party'},
  {abbr:'NRM',name:'National Rescue Movement'},
  {abbr:'PDP',name:'Peoples Democratic Party'},
  {abbr:'PRP',name:'Peoples Redemption Party'},
  {abbr:'SDP',name:'Social Democratic Party'},
  {abbr:'YP',name:'Youth Party'},
  {abbr:'YPP',name:'Young Progressives Party'},
  {abbr:'ZLP',name:'Zenith Labour Party'}
].map(p=>({...p,slug:p.abbr.toLowerCase(),logo:partyImage[p.abbr]||null}));
export const byAbbr = Object.fromEntries(parties.map(p=>[p.abbr,p]));
export const bySlug = Object.fromEntries(parties.map(p=>[p.slug,p]));
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://generalelection2027.com').replace(/\/$/,'');
