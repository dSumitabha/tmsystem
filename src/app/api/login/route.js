import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'; 
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();
    
    const user = await User.findOne({
      $or: [{ email: email }] 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Compare user input with hashed password stored in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Encode the secret
    // Creating a JWT token with role isAdmin
    const token = await new SignJWT({ userId: user._id, email: user.email, isAdmin: user.isAdmin })
                              .setProtectedHeader({ alg: 'HS256' }) // using HS256 the common algorithm 
                              .setExpirationTime('1d')
                              .sign(secret);

    // Set the token in cookies
    const response = NextResponse.json(
        { message: 'Login successful', token },
        { status: 200 }
    );
    
    response.cookies.set('token', token, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // safeguard for production and development
        maxAge: 86400, // 1 day in seconds
        path: '/', // so it can be accessed from anywhere
    });
    
    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
}