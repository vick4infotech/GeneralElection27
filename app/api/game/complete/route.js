import {NextResponse} from 'next/server';
import {ensure,gameUserFromRequest,rateLimit,createGuestToken,validGuestToken,guestCookieOptions,gameGuestDigest,requestRateKey,requestOriginMatches} from '../../../../lib/db';
import {evaluateGame,weeklyKey} from '../../../../lib/game/engine';
export const runtime='nodejs';
const noCache={'Cache-Control':'no-store'};
export async function POST(req){
 if(!requestOriginMatches(req))return NextResponse.json({error:'Invalid request origin.'},{status:403});
 try{
  const user=await gameUserFromRequest(req);
  if(!(await rateLimit('game-complete-ip:'+requestRateKey(req),40,3600)))return NextResponse.json({error:'Too many score submissions from this connection.'},{status:429});
  const body=await req.text();if(body.length>16000)return NextResponse.json({error:'Run data is too large.'},{status:413});
  const {game}=JSON.parse(body);const result=evaluateGame(game);
  if(!result.complete)return NextResponse.json({error:'Finish every scenario first.'},{status:400});
  if(game.mode==='weekly'&&game.week!==weeklyKey())return NextResponse.json({error:'This weekly challenge has ended.'},{status:400});
  const con=await ensure();const week=game.mode==='story'?'all-time':game.week;
  if(user){
   if(!(await rateLimit('game-complete-account:'+user.id,25,3600)))return NextResponse.json({error:'Too many score submissions.'},{status:429});
   await con.query(`INSERT INTO game_scores(account_id,mode,week_key,best_score) VALUES($1,$2,$3,$4)
   ON CONFLICT (account_id,mode,week_key) DO UPDATE SET best_score=GREATEST(game_scores.best_score,EXCLUDED.best_score),completed_at=CASE WHEN EXCLUDED.best_score>game_scores.best_score THEN NOW() ELSE game_scores.completed_at END`,[user.id,game.mode,week,result.score]);
   return NextResponse.json({ok:true,score:result.score,badges:result.badges},{headers:noCache});
  }
  const existing=req.cookies.get('ge27_game_guest')?.value;
  const token=validGuestToken(existing)?existing:createGuestToken();
  await con.query(`INSERT INTO guest_game_scores(token_hash,mode,week_key,best_score) VALUES($1,$2,$3,$4)
   ON CONFLICT (token_hash,mode,week_key) DO UPDATE SET best_score=GREATEST(guest_game_scores.best_score,EXCLUDED.best_score),completed_at=CASE WHEN EXCLUDED.best_score>guest_game_scores.best_score THEN NOW() ELSE guest_game_scores.completed_at END`,[gameGuestDigest(token),game.mode,week,result.score]);
  const response=NextResponse.json({ok:true,guest:true,score:result.score,badges:result.badges},{headers:noCache});
  response.cookies.set('ge27_game_guest',token,guestCookieOptions());
  return response;
 }catch(e){
  if(e instanceof SyntaxError || /invalid|choice|too many|allocation|budget|scenario|round/i.test(e.message||''))return NextResponse.json({error:'Invalid run data.'},{status:400});
  console.error('Game complete:',e.message);
  return NextResponse.json({error:'Unable to publish game score. Your game is still saved in this browser.'},{status:503});
 }
}
