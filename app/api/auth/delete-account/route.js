import {NextResponse} from 'next/server';
import {ensure,gameUserFromRequest} from '../../../../lib/db';
export const runtime='nodejs';
export async function DELETE(req){try{const user=await gameUserFromRequest(req);if(!user)return NextResponse.json({error:'Sign in first.'},{status:401});const con=await ensure();await con.query('DELETE FROM poll_accounts WHERE id=$1',[user.id]);const res=NextResponse.json({ok:true});res.cookies.set('ge27_session','',{maxAge:0,path:'/',httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production'});return res;}catch(e){console.error('Delete account:',e.message);return NextResponse.json({error:'Unable to delete account now.'},{status:503});}}
