import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(req) {
    const token = req.cookies.get('token')?.value
    const pathname = req.nextUrl.pathname

    // if visiting login or signup and already authenticated → redirect to dashboard again
    if (token && (pathname === '/login' || pathname === '/sign-up')) {
        return NextResponse.redirect(new URL('/', req.url)) // root url is dashboard here
    }

    // if visiting protected routes but NOT authenticated → redirect to login
    if (!token && (pathname === '/' || pathname.startsWith('/tasks'))) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // verifying token only when it exists (this is for protected routes)
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET)
            await jwtVerify(token, secret)
            // valid token will let it continue
            return NextResponse.next()
        } catch (err) {
            console.error('Invalid or expired token:', err)
            // bad token will redirect to login
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    // Default to allow request
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',             // dashboard protection
        '/tasks/:path*', // tasks pages
        '/login',        // handle redirect for logged-in users
        '/sign-up',      // handle redirect for logged-in users
    ],
}