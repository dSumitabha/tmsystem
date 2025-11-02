import { NextResponse } from "next/server";
import Task from "@/models/Task";

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
    try {
        const data = await request.json();
        const newTask = await Task.create(data);
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}