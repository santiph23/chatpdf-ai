
import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
    const response = NextResponse.next();

    const session = await getSession(req, response);

    // If is auth
    if (req.nextUrl.pathname === '/' && session?.user) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // if not auth
    if (req.nextUrl.pathname.startsWith('/dashboard') && !session?.user) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next();
}