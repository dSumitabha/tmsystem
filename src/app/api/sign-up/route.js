import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request) {
  try {
    await connectDB();

    const { fullName, email, password, confirmPassword, isAdmin } = await request.json();

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    await newUser.save();

    // Generate JWT token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: newUser._id.toString(), email: newUser.email, isAdmin: newUser.isAdmin })
                              .setProtectedHeader({ alg: 'HS256' })
                              .setExpirationTime('1d')
                              .sign(secret);

    // Create response and set the token cookie
    const response = NextResponse.json(
      { message: 'User registered and logged in successfully', token },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed', details: error.message },
      { status: 500 }
    );
  }
}