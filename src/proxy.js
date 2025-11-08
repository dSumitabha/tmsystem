import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(req) {
  const token = req.cookies.get('token')?.value
  const pathname = req.nextUrl.pathname

  // ---- 1️⃣ If visiting login or signup and already authenticated → redirect away
  if (token && (pathname === '/login' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', req.url)) // or '/dashboard'
  }

  // ---- 2️⃣ If visiting protected routes and NOT authenticated → redirect to login
  if (!token && (pathname === '/' || pathname.startsWith('/tasks') || pathname === '/create-task')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ---- 3️⃣ Verify token only when it exists (for protected routes)
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
      // valid token → continue
      return NextResponse.next()
    } catch (err) {
      console.error('Invalid or expired token:', err)
      // bad token → redirect to login
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // ---- 4️⃣ Default → allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',             // protect root
    '/tasks/:path*', // protect tasks pages
    '/create-task',
    '/login',        // handle redirect for logged-in users
    '/sign-up',       // handle redirect for logged-in users
  ],
}