import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import User from '@/models/User';
import { cookies } from 'next/headers';


export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const user = await User.findById(payload.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { user: { id: user._id, email: user.email, isAdmin: user.isAdmin } },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to retrieve user details', details: error.message },
            { status: 500 }
        );
    }
}