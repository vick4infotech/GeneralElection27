import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {gameUserFromRequest} from '../../../../../lib/db';
export const runtime='nodejs';
export async function GET(req){
 const appId=process.env.FACEBOOK_APP_ID,redirect=process.env.FACEBOOK_REDIRECT_URI;
 if(!appId||!redirect||!process.env.FACEBOOK_APP_SECRET)return NextResponse.redirect(new URL('/games?facebook=not-configured',process.env.NEXT_PUBLIC_SITE_URL||req.url));
 const nonce=crypto.randomBytes(28).toString('hex');
 const user=await gameUserFromRequest(req);
 const linking=new URL(req.url).searchParams.get('link')==='1'&&!!user;
 const destination=new URL(`https://www.facebook.com/${process.env.FACEBOOK_GRAPH_VERSION||'v24.0'}/dialog/oauth`);
 destination.searchParams.set('client_id',appId);destination.searchParams.set('redirect_uri',redirect);
 destination.searchParams.set('response_type','code');destination.searchParams.set('scope','public_profile');destination.searchParams.set('state',nonce);
 const res=NextResponse.redirect(destination);
 const secure=process.env.NODE_ENV==='production';
 res.cookies.set('ge27_fb_state',nonce,{httpOnly:true,secure,sameSite:'lax',path:'/',maxAge:600});
 res.cookies.set('ge27_fb_link',linking?'1':'0',{httpOnly:true,secure,sameSite:'lax',path:'/',maxAge:600});
 return res;
}
