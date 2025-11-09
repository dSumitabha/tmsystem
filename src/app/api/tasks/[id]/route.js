import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import User from "@/models/User";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// single instanse of task will use for both edit and show
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;    //without await it was throwing error

    const task = await Task.findById(id)
        .populate('createdBy', 'email, fullName')   //relation with user model
        .populate('assignedTo', 'email, fullName'); //same

    // not found response
    if (!task) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    // Return the task data with a 200 status code
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { message: 'Server Error' },
      { status: 500 }
    );
  }
}

// when the method will be PUT to update a task
export async function PUT(request, { params }) {
    await dbConnect();

    try {
        const { id } = await params;
        
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

        // taking exisiting task
        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        // a bit validation
        if (body.title && body.title.trim() === "") {
            return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
        }

        // unique id changed or not
        if (body.taskId && body.taskId !== existingTask.taskId) {
            const duplicateTask = await Task.findOne({ taskId: body.taskId, _id: { $ne: id } });
            if (duplicateTask) {
                return NextResponse.json({ error: "Task ID already exists" }, { status: 409 });
            }
        }

        // Validate assigned user re validatation it
        if (body.assignedTo) {
            const assignedUser = await User.findById(body.assignedTo);
            if (!assignedUser) {
                return NextResponse.json({ error: "Assigned user not found" }, { status: 404 });
            }
        }

        // Prepareing before update
        const updateData = {};
        
        if (body.taskId !== undefined) updateData.taskId = body.taskId.trim();
        if (body.title !== undefined) updateData.title = body.title.trim();
        if (body.description !== undefined) updateData.description = body.description;
        if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo || null;
        if (body.status !== undefined) updateData.status = body.status;
        if (body.priority !== undefined) updateData.priority = body.priority;
        if (body.dueDate !== undefined) updateData.dueDate = body.dueDate || null;

        // Update the task
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate("createdBy", "fullName email")
        .populate("assignedTo", "fullName email");

        return NextResponse.json(
            {
                success: true,
                message: "Task updated successfully",
                data: updatedTask,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Task update error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


//delete a task
export async function DELETE(request, { params }) {
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

        const { id } = await params;

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Task deleted successfully",
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Task deletion error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}