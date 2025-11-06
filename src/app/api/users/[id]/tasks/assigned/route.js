import { NextResponse } from 'next/server';
import { SignJWT } from 'jose'; 
import Task from '@/models/Task';
import User from '@/models/User';
import dbConnect from '@/lib/db';

const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Encode the secret

export async function GET(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();

    // Destructure the user ID from the params
    const { id } = await params;

    // Find the user by ID (optional: ensure the user exists before proceeding)
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Query tasks assigned to the user
    const tasks = await Task.find({ assignedTo: id })
      .populate('createdBy', 'fullName email')   // relation with user
      .populate('assignedTo', 'fullName email'); // ;

    // return a message if no tasks are found
    if (tasks.length === 0) {
      return NextResponse.json(
        { message: 'No tasks assigned to this user' },
        { status: 404 }
      );
    }

    const token = await new SignJWT({ userId: user._id.toString(), email: user.email, isAdmin: user.isAdmin })
      .setProtectedHeader({ alg: 'HS256' }) // HS256 for the JWT algorithm
      .setExpirationTime('1d')
      .sign(secret);

    return NextResponse.json({ tasks, token }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks for user:', error);
    return NextResponse.json(
      { message: 'Server Error' },
      { status: 500 }
    );
  }
}
