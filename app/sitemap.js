import {parties,siteUrl} from '../lib/parties';
import {candidates} from '../lib/candidates';
const lastVerified='2026-10-27T15:00:00.000Z';
export default function sitemap(){const staticPages=['','/election-2027','/election-2027/timetable','/voter-guide','/parties','/candidates','/election-results','/games','/advertise','/privacy','/credits'];const urls=[...staticPages,...parties.map(p=>`/parties/${p.slug}`),...candidates.map(c=>`/candidates/${c.slug}`)];return urls.map(path=>({url:siteUrl+path,lastModified:new Date(lastVerified),changeFrequency:path===''||path==='/games'?'daily':'monthly',priority:path===''?1:path==='/games'||path==='/election-2027'?0.9:0.7}))}
