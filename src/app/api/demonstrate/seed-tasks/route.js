import Task from '@/models/Task';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    await dbConnect();

    const adminUser = await User.findOne({ isAdmin: true });
    const regularUsers = await User.find({ isAdmin: false });

    if (!adminUser) throw new Error('No admin user found');
    if (regularUsers.length === 0) throw new Error('No regular users found');

    const tasksFilePath = path.resolve('src/data', 'tasks.json');
    const tasksData = JSON.parse(fs.readFileSync(tasksFilePath, 'utf8'));

    if (!Array.isArray(tasksData) || tasksData.length === 0) throw new Error('No tasks found');

    const tasksWithUserIds = tasksData.map((task) => ({
      ...task,
      createdBy: adminUser._id,
      assignedTo: regularUsers[Math.floor(Math.random() * regularUsers.length)]._id,
    }));
    
    const promises = tasksWithUserIds.map((task) =>
      Task.findOneAndUpdate(
        { taskId: task.taskId },  // Use taskId as the unique identifier
        { ...task, createdBy: task.createdBy, assignedTo: task.assignedTo },
        { upsert: true, new: true, runValidators: true }  // `upsert` creates if not found
      )
    );
    
    await Promise.all(promises);
    
    return new Response(JSON.stringify({ message: 'Tasks have been successfully seeded.' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to seed tasks: ${error.message}` }), { status: 500 });
  }
}