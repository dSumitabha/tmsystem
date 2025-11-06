import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';

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
