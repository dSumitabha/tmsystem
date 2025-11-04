import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { jwtVerify } from 'jose'; 
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        await connectDB();

        // Extract query parameters
        const url = new URL(request.url);
        const search = url.searchParams.get('search') || '';
        
        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Authorization token required' },
                { status: 401 }
            );
        }

        // Verify the JWT token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const decodedToken = await jwtVerify(token, secret);

        if (!decodedToken) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Construct filter object for search and isAdmin
        let filter = {};
        if (search) {
            // Modify regex to match the start of the fullName
            console.log("Regex Pattern:", new RegExp(`^${search}`, 'i')); // Starts with search term
            filter.fullName = { $regex: `^${search}`, $options: 'i' }; // Search by fullName starting with the search term (case-insensitive)
        }
        

        // Fetch the first 7 users where isAdmin is false
        const users = await User.find({ ...filter, isAdmin: false })
            .limit(7) // Limit to first 7 users
            .sort({ fullName: 1 }); // Sort alphabetically by fullName (ascending)

        return NextResponse.json(
            { users },
            { status: 200 }
        );
        
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Unable to fetch users', details: error.message },
            { status: 500 }
        );
    }
}
