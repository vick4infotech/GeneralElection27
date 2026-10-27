import {NextResponse} from 'next/server';
import {userFromRequest} from '../../../../lib/db';
export const runtime='nodejs';
export async function GET(req){const user=await userFromRequest(req);return NextResponse.json(user?{authenticated:true,username:user.username}:{authenticated:false},{headers:{'Cache-Control':'no-store'}});}
