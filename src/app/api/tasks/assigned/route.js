import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Task from '@/models/Task';
import User from '@/models/User';
import dbConnect from '@/lib/db';

//this route will show the assigned tasks from the auth token
export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        let decoded;
        try {
            const { payload } = await jwtVerify(token, secret);
            decoded = payload;
        } catch (err) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        const userId = decoded.userId;

        await dbConnect();

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const searchParams = request.nextUrl.searchParams;


        const status = searchParams.get('status');

        // base query will execute without parametes
        const query = { assignedTo: user._id };

        // will use this to filters
        if (status) query.status = status;

        // Query tasks assigned to the user
        const tasks = await Task.find(query)
            .populate('createdBy', 'fullName email')   // relation with user
            .populate('assignedTo', 'fullName email'); // same 

        if (tasks.length === 0) {
            return NextResponse.json({ tasks: [] }, { message: 'No tasks found for this user' }, { status: 200 });
        }

        return NextResponse.json({ tasks }, { status: 200 });

    } catch (error) {
        console.error('Error fetching tasks for user:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}