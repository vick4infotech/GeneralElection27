// Shared deterministic civic-simulation rules: run in client and server.
// All quantities, outcomes and stories are fictional game mechanics.
export const departments = [
  {id:'electricity',label:'Power',icon:'⚡',color:'#e7b350',blurb:'Keep homes, markets and factories running.'},
  {id:'security',label:'Security',icon:'🛡️',color:'#7cbaf4',blurb:'Protect people and support local prevention.'},
  {id:'education',label:'Education',icon:'🎓',color:'#b09bff',blurb:'Support teachers, skills and classrooms.'},
  {id:'healthcare',label:'Healthcare',icon:'🏥',color:'#f490aa',blurb:'Improve care, equipment and clinics.'},
  {id:'jobs',label:'Jobs',icon:'💼',color:'#82d5b2',blurb:'Help enterprises and workers thrive.'},
  {id:'roads',label:'Transport',icon:'🚍',color:'#edb37e',blurb:'Connect communities and commercial routes.'},
];
export const defaultAllocations = {electricity:15,security:15,education:15,healthcare:15,jobs:10,roads:10};
const choices = (a,b,c)=>[a,b,c];
// Every scenario deliberately offers several reasonable trade-offs. There is no
// reference to a real candidate or party in the game.
export const scenarios = [
 {id:'power-grid',year:1,region:'Abuja',tag:'ENERGY',icon:'⚡',headline:'The lights go out at dinner time',brief:'A grid fault disrupts homes and businesses. Your ministers arrive with three plans.',speaker:'Minister of Power',options:choices(
  {title:'Rush repairs to the affected lines',cost:6,delta:{electricity:13,jobs:2,trust:3},news:'Teams restore several lines. People celebrate the quick response, but emergency repairs stretch the treasury.'},
  {title:'Launch neighbourhood solar pilots',cost:4,delta:{electricity:8,jobs:4,trust:4},news:'Local solar pilots begin. The rollout is slower, but businesses see an opportunity.'},
  {title:'Commission a transparent power audit',cost:0,delta:{electricity:2,trust:-3,education:1},news:'A public audit is announced. Citizens await practical repairs.'})},
 {id:'hospital-supplies',year:1,region:'Enugu',tag:'HEALTH',icon:'🏥',headline:'Clinics run short of essential supplies',brief:'A hospital network warns that medicine deliveries are becoming unreliable.',speaker:'Minister of Health',options:choices(
  {title:'Release emergency medical supplies',cost:6,delta:{healthcare:13,trust:3},news:'Essential medicine reaches the clinics; supply managers request long-term planning.'},
  {title:'Upgrade regional supply logistics',cost:4,delta:{healthcare:8,roads:5,trust:2},news:'New distribution routes are approved and warehouse teams start reorganising deliveries.'},
  {title:'Publish a stock and procurement audit',cost:0,delta:{healthcare:2,trust:1},news:'An open inventory review begins, though some clinics still face shortages.'})},
 {id:'market-roads',year:1,region:'Kano',tag:'TRANSPORT',icon:'🚚',headline:'Farm produce is stuck on bad roads',brief:'Traders say transport costs are eating their profits and food is arriving late.',speaker:'Minister of Works',options:choices(
  {title:'Repair the busiest market corridors',cost:6,delta:{roads:13,jobs:3,trust:2},news:'Contractors begin repairs on key routes. Traffic improves in the simulation.'},
  {title:'Support logistics cooperatives',cost:3,delta:{roads:7,jobs:7,trust:2},news:'Transport cooperatives coordinate deliveries while road repairs remain a longer-term need.'},
  {title:'Map and publish the worst corridors',cost:0,delta:{roads:2,trust:0},news:'An interactive map identifies priority routes for future budgets.'})},
 {id:'school-roofs',year:1,region:'Kaduna',tag:'EDUCATION',icon:'🏫',headline:'School roofs leak during heavy rain',brief:'Teachers ask for repairs before the next school term begins.',speaker:'Minister of Education',options:choices(
  {title:'Renovate affected schools at once',cost:6,delta:{education:13,trust:3},news:'Renovation crews are deployed and classes resume in improved rooms.'},
  {title:'Fund community school-maintenance teams',cost:4,delta:{education:9,jobs:3,trust:4},news:'Communities join repair teams and local tradespeople receive contracts.'},
  {title:'Conduct nationwide facility inspections',cost:0,delta:{education:2,trust:-1},news:'Inspectors document building needs while teachers ask for a repair timetable.'})},
 {id:'market-prices',year:1,region:'Lagos',tag:'ECONOMY',icon:'🛒',headline:'The price of basic goods is climbing',brief:'Market associations want lower logistics costs and more predictable supplies.',speaker:'Minister of Finance',options:choices(
  {title:'Support targeted food distribution',cost:6,delta:{trust:9,roads:3,jobs:1},news:'Targeted distribution improves short-term access but requires careful oversight.'},
  {title:'Reduce bottlenecks for local producers',cost:4,delta:{jobs:9,roads:4,trust:3},news:'Local supply-chain support begins, with benefits emerging gradually.'},
  {title:'Publish weekly market-price dashboards',cost:0,delta:{education:2,trust:1},news:'People can now compare market prices, though the dashboard cannot lower costs on its own.'})},
 {id:'community-dialogue',year:1,region:'Plateau',tag:'SECURITY',icon:'🕊️',headline:'Communities request a safety plan',brief:'Local leaders ask for safer routes, reliable reporting and conflict-prevention support.',speaker:'National Security Adviser',options:choices(
  {title:'Expand emergency response coordination',cost:6,delta:{security:12,trust:3},news:'Response teams improve coordination and communities receive updated emergency contacts.'},
  {title:'Support local peace-building networks',cost:4,delta:{security:9,education:3,trust:4},news:'Neighbourhood dialogue groups begin work alongside existing safety agencies.'},
  {title:'Launch a transparent safety assessment',cost:0,delta:{security:2,trust:0},news:'A public safety assessment begins; residents want prompt follow-through.'})},
 {id:'student-skills',year:2,region:'Oyo',tag:'JOBS',icon:'🧑‍💻',headline:'Graduates demand more practical skills',brief:'Employers say applicants need hands-on training; graduates want accessible jobs.',speaker:'Minister of Labour',options:choices(
  {title:'Scale apprenticeships with employers',cost:6,delta:{jobs:12,education:5,trust:2},news:'Apprenticeship openings grow and employers participate in curriculum design.'},
  {title:'Fund community digital training centres',cost:4,delta:{jobs:8,education:8,trust:2},news:'New training hubs open; the programme will need skilled instructors.'},
  {title:'Convene an employment listening forum',cost:0,delta:{jobs:2,trust:-1},news:'A public jobs forum hears detailed proposals; action plans are requested.'})},
 {id:'flood-preparedness',year:2,region:'Bayelsa',tag:'ENVIRONMENT',icon:'🌧️',headline:'Flood warnings reach river communities',brief:'Forecasters warn about heavy rainfall. Residents need evacuation information and resilient infrastructure.',speaker:'Emergency Management Adviser',options:choices(
  {title:'Fund shelters and emergency supplies',cost:6,delta:{security:10,healthcare:6,trust:3},news:'Temporary shelters and medical supplies are prepared ahead of high water.'},
  {title:'Strengthen drains and local warning systems',cost:4,delta:{roads:7,security:6,trust:4},news:'Community alerts and drainage work reduce exposure in the game.'},
  {title:'Launch a flood information campaign',cost:0,delta:{education:2,security:2},news:'Public warnings spread quickly, but physical defences remain limited.'})},
 {id:'primary-care',year:2,region:'Borno',tag:'HEALTH',icon:'🩺',headline:'Rural clinics need more health workers',brief:'Families travel too far for basic care. Regional health teams request support.',speaker:'Minister of Health',options:choices(
  {title:'Recruit and retain local clinicians',cost:6,delta:{healthcare:13,jobs:3,trust:3},news:'Clinics recruit staff and begin extending appointment hours.'},
  {title:'Support mobile health teams',cost:4,delta:{healthcare:9,roads:2,trust:2},news:'Mobile teams bring care closer to remote communities.'},
  {title:'Publish a health workforce assessment',cost:0,delta:{healthcare:2,education:1},news:'The staffing gap becomes clearer, helping prepare next year’s spending.'})},
 {id:'business-permits',year:2,region:'Rivers',tag:'ENTERPRISE',icon:'🏪',headline:'Small businesses face long registration queues',brief:'Entrepreneurs want simpler procedures and more predictable government services.',speaker:'Enterprise Adviser',options:choices(
  {title:'Digitise and simplify the permit process',cost:5,delta:{jobs:10,trust:6,education:2},news:'Application times shrink in the simulation; offices begin retraining staff.'},
  {title:'Open mobile one-stop service centres',cost:3,delta:{jobs:7,trust:5,roads:1},news:'Entrepreneurs can access support in more communities.'},
  {title:'Publish a permit turnaround scoreboard',cost:0,delta:{jobs:2,trust:2},news:'A new public scoreboard reveals slow approvals and encourages discussion.'})},
 {id:'water-system',year:2,region:'Sokoto',tag:'WATER',icon:'💧',headline:'Communities ask for reliable clean water',brief:'A water network needs maintenance and households are reporting supply interruptions.',speaker:'Infrastructure Adviser',options:choices(
  {title:'Repair pumping and filtration equipment',cost:6,delta:{healthcare:9,electricity:2,trust:4},news:'Water reliability improves in several wards, bringing health benefits.'},
  {title:'Support decentralised water committees',cost:4,delta:{healthcare:6,jobs:4,trust:5},news:'Local water committees begin maintenance programmes.'},
  {title:'Conduct a water-quality survey',cost:0,delta:{healthcare:2,trust:1},news:'Water-quality findings are released while repairs await funding.'})},
 {id:'transit-traffic',year:2,region:'Abuja',tag:'TRANSPORT',icon:'🚦',headline:'Commuters are stuck in traffic again',brief:'A busy city corridor is losing hours to congestion.',speaker:'Minister of Transport',options:choices(
  {title:'Fund junction redesign and safer crossings',cost:6,delta:{roads:12,security:2,trust:3},news:'Junctions are redesigned and crossing safety improves.'},
  {title:'Pilot better bus routes and scheduling',cost:4,delta:{roads:8,jobs:4,trust:4},news:'Scheduled bus services reduce pressure at peak times.'},
  {title:'Open a commuter-feedback programme',cost:0,delta:{roads:2,trust:1},news:'Commuters submit thousands of route suggestions.'})},
 {id:'teacher-retention',year:3,region:'Katsina',tag:'EDUCATION',icon:'📚',headline:'Rural schools struggle to keep teachers',brief:'Education leaders report staffing gaps and crowded classrooms.',speaker:'Minister of Education',options:choices(
  {title:'Fund incentives and teacher housing',cost:6,delta:{education:13,jobs:3,trust:3},news:'Teacher retention improves and more schools fill vacancies.'},
  {title:'Expand teacher support and training',cost:4,delta:{education:10,trust:4},news:'Training networks and peer support programmes attract participation.'},
  {title:'Publish transparent vacancy statistics',cost:0,delta:{education:2,trust:1},news:'The staffing problem is documented more clearly.'})},
 {id:'farmers-storage',year:3,region:'Benue',tag:'AGRICULTURE',icon:'🌾',headline:'Harvests spoil before reaching markets',brief:'Farmers are asking for better cold storage and reliable logistics.',speaker:'Agriculture Adviser',options:choices(
  {title:'Co-fund regional storage facilities',cost:6,delta:{jobs:9,roads:6,trust:3},news:'New storage centres reduce simulated post-harvest losses.'},
  {title:'Support cooperatives and mobile cold rooms',cost:4,delta:{jobs:8,electricity:3,roads:3},news:'Farmer cooperatives improve market access and storage practices.'},
  {title:'Share open crop-market data',cost:0,delta:{jobs:2,education:2},news:'Farmers access a new price and logistics information service.'})},
 {id:'digital-services',year:3,region:'Lagos',tag:'DIGITAL',icon:'💻',headline:'Government portals are painfully slow',brief:'Residents want smoother online public services without waiting in long queues.',speaker:'Digital Transformation Adviser',options:choices(
  {title:'Modernise high-traffic services',cost:6,delta:{trust:9,jobs:3,education:4},news:'Several digital services become easier to use; staff receive training.'},
  {title:'Create accessible mobile-first service desks',cost:4,delta:{trust:8,jobs:4,roads:1},news:'More residents can complete common requests from their phones.'},
  {title:'Open a service-feedback portal',cost:0,delta:{trust:2,education:1},news:'Public reports identify the most frustrating bottlenecks.'})},
 {id:'heat-wave',year:3,region:'Jigawa',tag:'CLIMATE',icon:'☀️',headline:'Extreme heat strains homes and schools',brief:'A fictional heatwave creates additional health and energy demand.',speaker:'Emergency Management Adviser',options:choices(
  {title:'Create cooling shelters and health outreach',cost:6,delta:{healthcare:11,security:3,trust:4},news:'Cooling stations open for vulnerable residents.'},
  {title:'Improve school ventilation and water points',cost:4,delta:{education:7,healthcare:7,trust:3},news:'Schools adapt schedules and install basic heat safeguards.'},
  {title:'Publish heat-safety information',cost:0,delta:{healthcare:2,education:2},news:'Weather guidance spreads through local communities.'})},
 {id:'market-fire',year:3,region:'Anambra',tag:'EMERGENCY',icon:'🚒',headline:'A major market needs fire safeguards',brief:'Traders request safer wiring, alarms and faster emergency response.',speaker:'Emergency Services Director',options:choices(
  {title:'Upgrade response equipment and stations',cost:6,delta:{security:9,jobs:4,trust:4},news:'Fire crews gain equipment and response times improve.'},
  {title:'Train traders and improve safety inspections',cost:4,delta:{security:7,education:5,trust:4},news:'Safety training reaches market associations and insurers take notice.'},
  {title:'Run a free awareness drive',cost:0,delta:{security:2,education:2},news:'More traders learn basic fire-prevention steps.'})},
 {id:'housing-rent',year:3,region:'Ogun',tag:'HOUSING',icon:'🏘️',headline:'Rents put pressure on young families',brief:'Housing advocates ask for better planning and transport links.',speaker:'Urban Development Adviser',options:choices(
  {title:'Pilot affordable mixed-use housing',cost:6,delta:{jobs:7,roads:6,trust:4},news:'A mixed-use housing pilot gets underway, creating jobs and debate.'},
  {title:'Improve land records and infrastructure',cost:4,delta:{roads:6,jobs:5,trust:4},news:'Improved planning data unlocks several redevelopment proposals.'},
  {title:'Publish a public housing-needs study',cost:0,delta:{education:2,trust:1},news:'The report clarifies affordability gaps but does not immediately create homes.'})},
 {id:'health-records',year:4,region:'Akwa Ibom',tag:'HEALTH',icon:'📋',headline:'Patients carry paper files between hospitals',brief:'Health professionals want safer and faster coordination of medical records.',speaker:'Minister of Health',options:choices(
  {title:'Build a secure health records pilot',cost:6,delta:{healthcare:12,education:3,trust:4},news:'A pilot reduces repeat paperwork with new privacy safeguards.'},
  {title:'Train staff on shared care pathways',cost:4,delta:{healthcare:8,education:5,trust:3},news:'Clinics introduce clearer referral procedures.'},
  {title:'Draft data-protection and record standards',cost:0,delta:{healthcare:2,trust:2},news:'A public consultation begins on safe records exchange.'})},
 {id:'research-labs',year:4,region:'Abia',tag:'INNOVATION',icon:'🔬',headline:'Young innovators need support',brief:'Universities and startups propose applied research partnerships.',speaker:'Science & Technology Adviser',options:choices(
  {title:'Fund university-industry innovation labs',cost:6,delta:{jobs:10,education:7,trust:2},news:'Research labs begin collaborating with local employers.'},
  {title:'Support low-cost community maker spaces',cost:4,delta:{education:9,jobs:7,trust:2},news:'Maker spaces welcome students and small inventors.'},
  {title:'Publish an open innovation challenge',cost:0,delta:{jobs:2,education:2},news:'Innovators submit prototypes to an open competition.'})},
 {id:'road-safety',year:4,region:'Niger',tag:'TRANSPORT',icon:'🚧',headline:'Road users demand safer highways',brief:'Transport unions request better road markings and emergency support.',speaker:'Transport Adviser',options:choices(
  {title:'Improve dangerous junctions and signage',cost:6,delta:{roads:10,security:5,trust:3},news:'Several highway sections receive safety improvements.'},
  {title:'Expand emergency response and road education',cost:4,delta:{roads:6,security:6,education:2},news:'Road users receive better safety guidance and support.'},
  {title:'Map road-risk hotspots',cost:0,delta:{roads:2,trust:1},news:'Risk maps help planners identify next priorities.'})},
 {id:'power-tariff',year:4,region:'Ekiti',tag:'ENERGY',icon:'🔋',headline:'Electricity bills spark fresh debate',brief:'Households want affordability while utilities request funding for repairs.',speaker:'Minister of Power',options:choices(
  {title:'Support targeted efficiency upgrades',cost:6,delta:{electricity:12,trust:5},news:'Efficiency upgrades improve supply in the pilot programme.'},
  {title:'Back community energy-saving grants',cost:4,delta:{electricity:8,jobs:4,trust:5},news:'Residents begin replacing wasteful equipment and sharing energy-saving tips.'},
  {title:'Publish simplified billing comparisons',cost:0,delta:{education:3,trust:2},news:'Consumers gain more transparent electricity billing information.'})},
 {id:'public-trust',year:4,region:'Cross River',tag:'GOVERNANCE',icon:'📢',headline:'Citizens ask: where did the money go?',brief:'Residents want a clear summary of four years of projects and outcomes.',speaker:'Public Accountability Adviser',options:choices(
  {title:'Commission open independent project reviews',cost:5,delta:{trust:12,education:2},news:'The Presidency publishes independent project reviews, including setbacks.'},
  {title:'Publish a citizen-friendly spending dashboard',cost:3,delta:{trust:9,education:3},news:'Residents explore spending, projects and completion reports online.'},
  {title:'Hold an open national questions forum',cost:0,delta:{trust:4,education:1},news:'Citizens ask tough questions about project delays and government choices.'})},
 {id:'last-budget',year:4,region:'FCT',tag:'FINAL BRIEFING',icon:'🏛️',headline:'Your final budget meeting begins',brief:'Your cabinet asks what should be prioritised before your four-year report card.',speaker:'Chief of Staff',options:choices(
  {title:'Complete unfinished public-service projects',cost:6,delta:{roads:5,healthcare:5,trust:5},news:'The administration prioritises finishing several earlier programmes.'},
  {title:'Build a long-term service maintenance fund',cost:4,delta:{electricity:5,education:5,security:3},news:'A maintenance fund is created to support continuity beyond this term.'},
  {title:'Publish an honest end-of-term review',cost:0,delta:{trust:5,education:2},news:'The final report openly lists gains, limitations and unresolved issues.'})},
];
const clamp = n=>Math.round(Math.max(0,Math.min(100,n)));
export const allocationTotal = a=>departments.reduce((sum,d)=>sum+Number(a[d.id]||0),0);
export function validAllocations(a){return !!a&&typeof a==='object'&&departments.every(d=>Number.isInteger(a[d.id])&&a[d.id]>=0&&a[d.id]<=50&&a[d.id]%5===0)&&allocationTotal(a)===80;}
export function weeklyKey(date=new Date()){
 const d=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()));
 d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));
 const year=d.getUTCFullYear();const jan1=new Date(Date.UTC(year,0,1));
 return `${year}-W${String(Math.ceil((((d-jan1)/86400000)+1)/7)).padStart(2,'0')}`;
}
export function getRounds(mode='story',week=weeklyKey()){
 if(mode==='story')return scenarios;
 if(mode!=='weekly')return [];
 const n=Number(week.replace(/\D/g,''))||1;
 const start=n%scenarios.length;
 return Array.from({length:5},(_,i)=>scenarios[(start+i*5)%scenarios.length]);
}
export function freshGame(mode='story',week=weeklyKey()){
 return {version:1,mode,week,allocations:{...defaultAllocations},started:false,choices:[],sound:false};
}
export function evaluateGame(game){
 if(!game||game.version!==1||!['story','weekly'].includes(game.mode)||!/^\d{4}-W\d{2}$/.test(game.week||'')||!validAllocations(game.allocations)||!Array.isArray(game.choices))throw Error('Invalid game state');
 const rounds=getRounds(game.mode,game.week);if(game.choices.length>rounds.length)throw Error('Too many choices');
 const stats=Object.fromEntries(departments.map(d=>[d.id,clamp(25+game.allocations[d.id]*1.35)]));stats.trust=50;
 let treasury=20,spent=0,news=[];
 for(let i=0;i<game.choices.length;i++){
  const pick=game.choices[i];if(!Number.isInteger(pick)||pick<0||pick>2)throw Error('Invalid choice');
  if(game.mode==='story'&&i>0&&i%6===0)treasury+=15;
  const event=rounds[i],action=event.options[pick];if(!action||action.cost>treasury)throw Error('Choice exceeds treasury');
  treasury-=action.cost;spent+=action.cost;
  for(const [id,value] of Object.entries(action.delta))stats[id]=clamp((stats[id]||0)+value);
  news.push({scenario:event.headline,region:event.region,year:event.year,text:action.news,decision:action.title});
 }
 const complete=game.started&&game.choices.length===rounds.length;
 const avg=departments.reduce((n,d)=>n+stats[d.id],stats.trust)/(departments.length+1);
 const score=clamp(avg)*10+Math.min(100,treasury*2);
 const badges=[];
 if(game.choices.length>=1)badges.push({id:'first-decision',icon:'🎖️',title:'First Presidential Briefing'});
 if(game.choices.length>=6)badges.push({id:'six-briefings',icon:'⚡',title:'On the Job'});
 if(complete)badges.push({id:'term-finished',icon:'🏛️',title:game.mode==='story'?'Four Years at Aso Rock':'Weekly Challenge Complete'});
 if(complete&&treasury>=15)badges.push({id:'budget-guardian',icon:'💰',title:'Budget Guardian'});
 if(complete&&Object.values(stats).every(n=>n>=50))badges.push({id:'balanced-leadership',icon:'⚖️',title:'Balanced Leadership'});
 return {stats,treasury,spent,score,badges,complete,round:game.choices.length,total:rounds.length,news};
}
