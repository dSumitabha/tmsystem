import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a response message
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Clear the token cookie by setting it to expire immediately
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Expire the cookie
      path: '/', // Match the path used when setting the cookie
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed', details: error.message },
      { status: 500 }
    );
  }
}
