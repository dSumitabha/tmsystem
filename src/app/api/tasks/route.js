import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Task from "@/models/Task";
import User from "@/models/User";
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

//basic route set up to get all the tasks of the system
export async function GET() {
    try {
        const tasks = await Task.find();
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

//very basic route setup to create a task
export async function POST(request) {
    console.log("POST request received")
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
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.taskId) {
            return NextResponse.json({ error: "Title and taskId are required" }, { status: 400 });
        }

        // Check for unique taskId
        const existingTask = await Task.findOne({ taskId: body.taskId });
        if (existingTask) {
            return NextResponse.json({ error: "Task ID already exists" }, { status: 409 });
        }

        // Validate assigned user (if provided)
        if (body.assignedTo) {
            const assignedUser = await User.findById(body.assignedTo);
            if (!assignedUser) {
                return NextResponse.json({ error: "Assigned user not found" }, { status: 404 });
            }
        }

        const newTask = await Task.create({
            taskId: body.taskId.trim(),
            title: body.title.trim(),
            description: body.description || "",
            createdBy: userId,
            assignedTo: body.assignedTo || null,
            status: body.status || "pending",
            priority: body.priority || "medium",
            dueDate: body.dueDate || null,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Task created successfully",
                data: newTask,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Task creation error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}