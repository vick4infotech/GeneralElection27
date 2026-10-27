import PartyMark from './PartyMark';
import CandidatePortrait from './CandidatePortrait';
export default function PollResults({summary,compact=false}){
  if(summary.status==='not-configured') return <div className="muted-card">Community poll is being set up. Results will appear when voting opens.</div>;
  if(summary.status!=='ok') return <div className="muted-card">Poll results are temporarily unavailable.</div>;
  if(!summary.total) return <div className="muted-card">No email-verified responses yet. Poll totals begin at zero — no simulated data.</div>;
  const items=compact?summary.rows.filter(x=>x.votes>0).slice(0,3):summary.rows;
  return <>
    <div className="poll-total"><strong>{summary.total.toLocaleString('en-NG')}</strong> email-verified response{summary.total===1?'':'s'} <span>· updated {new Date(summary.updatedAt).toLocaleString('en-NG',{timeZone:'Africa/Lagos',dateStyle:'medium',timeStyle:'short'})} WAT</span></div>
    <div className="result-list">{items.map((p,i)=><div className="result" key={p.abbr}>
      <span className="result-rank">{i+1}</span><CandidatePortrait candidate={p} size="small"/><PartyMark party={p} size="small"/><div className="result-main"><div className="result-title"><span>{p.name} <small className="result-party">({p.abbr})</small></span><b>{p.percent.toFixed(1)}%</b></div><div className="result-track"><div style={{width:`${p.percent}%`}}/></div><span className="result-votes">{p.votes.toLocaleString('en-NG')} response{p.votes===1?'':'s'}</span></div>
    </div>)}</div>
  </>;
}
