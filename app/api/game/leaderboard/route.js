import {NextResponse} from 'next/server';
import {ensure} from '../../../../lib/db';
import {weeklyKey} from '../../../../lib/game/engine';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req){
 const mode=new URL(req.url).searchParams.get('mode')==='story'?'story':'weekly';const week=mode==='story'?'all-time':weeklyKey();
 try{
  const con=await ensure();
  const r=await con.query(`SELECT name,score,completed_at FROM (
    SELECT COALESCE(f.display_name,p.username) AS name,g.best_score AS score,g.completed_at
    FROM game_scores g JOIN poll_accounts p ON p.id=g.account_id
    LEFT JOIN facebook_connections f ON f.account_id=p.id WHERE g.mode=$1 AND g.week_key=$2
    UNION ALL
    SELECT 'Guest ' || UPPER(SUBSTRING(g.token_hash,1,5)) AS name,g.best_score AS score,g.completed_at
    FROM guest_game_scores g WHERE g.mode=$1 AND g.week_key=$2
   ) scores ORDER BY score DESC,completed_at ASC LIMIT 25`,[mode,week]);
  return NextResponse.json({status:'ok',mode,week,rows:r.rows},{headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('Leaderboard:',e.message);return NextResponse.json({status:'unavailable',mode,week,rows:[]},{headers:{'Cache-Control':'no-store'}});}
}
