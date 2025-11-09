import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import { jwtVerify } from "jose";
import Task from "@/models/Task";
import User from "@/models/User";
import { cookies } from 'next/headers';

export async function GET(request) {
    await dbConnect();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        let decoded;
        
        try {
            const { payload } = await jwtVerify(token, secret);
            decoded = payload;
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        const userId = decoded.userId;

        // Fetch user details to check if the user is an admin
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Checking if  the user is admin,
        const isAdmin = user.isAdmin;
        
        let query = {};
        if (!isAdmin) {
            query.createdBy = userId;
        }

        // showing task stats: total, completed, pending
        const taskStats = await Task.aggregate([
            { $match: query }, // Match tasks based on the user (or all if admin)
            { $group: {
                _id: null,
                total: { $sum: 1 },
                completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                inProgress: { $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] } }
            }},
        ]);

        if (!taskStats || taskStats.length === 0) {
            return NextResponse.json({
                total: 0,
                completed: 0,
                pending: 0,
                inProgress: 0,
            });
        }

        const stats = taskStats[0];

        return NextResponse.json({
            total: stats.total,
            completed: stats.completed,
            pending: stats.pending,
            inProgress: stats.inProgress,
        }, { status: 200 });
        
    } catch (err) {
        console.error("Error fetching task stats:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}