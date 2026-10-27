import {NextResponse} from 'next/server';
import {ensure,gameUserFromRequest,rateLimit} from '../../../../lib/db';
import {evaluateGame,weeklyKey} from '../../../../lib/game/engine';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const uncached={'Cache-Control':'private, no-store'};
export async function GET(req){
 const user=await gameUserFromRequest(req);
 if(!user)return NextResponse.json({authenticated:false},{headers:uncached});
 try{const con=await ensure();const r=await con.query('SELECT state,updated_at FROM game_progress WHERE account_id=$1',[user.id]);
 return NextResponse.json({authenticated:true,user,save:r.rows[0]?.state||null,updatedAt:r.rows[0]?.updated_at||null},{headers:uncached});
 }catch{return NextResponse.json({error:'Game progress is currently unavailable.'},{status:503,headers:uncached});}
}
export async function PUT(req){
 const user=await gameUserFromRequest(req);if(!user)return NextResponse.json({error:'Sign in to save your progress.'},{status:401});
 try{const body=await req.json();if(JSON.stringify(body).length>12000)return NextResponse.json({error:'Game data exceeds size limit.'},{status:413});
 const state=body.save;
 const outcome=evaluateGame(state);
 if(state?.mode==='weekly'&&state.week!== weeklyKey())return NextResponse.json({error:'This weekly challenge has expired.'},{status:400});
 if(!(await rateLimit('game-save:'+user.id,300,3600)))return NextResponse.json({error:'Too many save requests.'},{status:429});
 const con=await ensure();const clean={version:1,mode:state.mode,week:state.week,allocations:state.allocations,started:state.started===true,choices:state.choices};
 await con.query(`INSERT INTO game_progress (account_id,state) VALUES ($1,$2) ON CONFLICT (account_id)
 DO UPDATE SET state=EXCLUDED.state,updated_at=NOW()`,[user.id,JSON.stringify(clean)]);
 return NextResponse.json({ok:true,round:outcome.round,complete:outcome.complete},{headers:uncached});
 }catch(e){if(e.message?.startsWith('Invalid')||e.message?.startsWith('Choice')||e.message?.startsWith('Too many'))return NextResponse.json({error:e.message},{status:400});console.error('Game save:',e.message);return NextResponse.json({error:'Unable to save progress.'},{status:503});}
}
