import Link from 'next/link';
import './globals.css';
import {siteUrl} from '../lib/parties';
import HicroftWelcome from '../components/HicroftWelcome';
import NigeriaInsignia from '../components/NigeriaInsignia';
// Wikimedia Commons coat-of-arms illustration: Lumia1234, CC BY-SA 3.0 (see /credits).
const nigerianCoatIcon='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Coat_of_arms_of_Nigeria.svg/330px-Coat_of_arms_of_Nigeria.svg.png';
export const metadata={
 metadataBase:new URL(siteUrl),
 title:{default:'Nigeria General Election 2027 | Election Dates, Candidates, Parties & Results',template:'%s | General Election 2027'},
 description:'Nigeria 2027 general election: INEC timetable, presidential candidates, political parties, voting and PVC information, state election guides, election results and Oga President Fix Naija games.',
 applicationName:'General Election 2027',
 icons:{icon:[{url:nigerianCoatIcon,type:'image/png'}],shortcut:[{url:nigerianCoatIcon,type:'image/png'}],apple:[{url:nigerianCoatIcon,type:'image/png'}]},
 robots:{index:true,follow:true,maxImagePreview:'large',maxSnippet:-1,maxVideoPreview:-1},
 openGraph:{siteName:'General Election 2027',type:'website',locale:'en_NG',images:[{url:'/opengraph-image.png',width:1200,height:630,alt:'Nigeria General Election 2027 information and games'}]},
 twitter:{card:'summary_large_image'},
 category:'news'
};
export default function RootLayout({children}){return <html lang="en-NG"><body>
 <header className="site-header"><div className="shell nav"><Link href="/" className="brand" aria-label="General Election 2027 home"><span className="brand-icon"><img src="/nigeria-flag.svg" alt="" width="38" height="25"/></span><span>GENERAL <b>ELECTION</b><small>NIGERIA 2027</small></span></Link><nav aria-label="Main navigation"><Link href="/election-2027">2027 Election</Link><Link href="/parties">Parties</Link><Link href="/candidates">Candidates</Link><Link href="/election-results">Results</Link><Link href="/games">🎮 Games</Link><Link href="/advertise">Advertise</Link></nav></div></header>
 <main id="main-content">{children}</main>
 <footer className="footer"><div className="shell footer-grid"><div><b>GENERAL ELECTION 2027</b><p>Nigeria 2027 election information, candidate profiles, public-interest games and community conversation.</p><div className="footer-national"><NigeriaInsignia coatOfArms className="footer-emblem"/><img src="/nigeria-flag.svg" width="74" height="48" alt="Flag of Nigeria"/></div></div><div><h3>Explore</h3><Link href="/election-2027">Election 2027</Link><Link href="/parties">Political parties</Link><Link href="/candidates">Presidential candidates</Link><Link href="/games">Games and poll</Link><Link href="/voter-guide">Voter guide & PVC</Link><Link href="/election-2027/timetable">INEC timetable</Link></div><div><h3>Work with Hicroft</h3><Link href="/advertise">Advertising and campaigns</Link><a href="mailto:hicrofttechnology@gmail.com">hicrofttechnology@gmail.com</a><Link href="/credits">Image credits</Link><Link href="/privacy">Privacy</Link><a href="https://www.inecnigeria.org/" target="_blank" rel="noopener noreferrer">INEC source ↗</a><img className="footer-hicroft" src="/hicroft-transparent.png" width="135" height="125" alt="Hicroft Technology"/></div></div><div className="shell copyright">© {new Date().getFullYear()} General Election 2027 · Built by Hicroft Technology · <Link href="/advertise">Advertise</Link> · <Link href="/privacy">Privacy</Link></div></footer>
 <HicroftWelcome/>
 </body></html>}
