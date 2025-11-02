// app/api/test/route.js
import dbConnect from '../../../lib/db';  // Import your dbConnect utility

export async function GET(req) {
  try {
    // Establish the database connection
    await dbConnect();

    // Perform a simple query to test the connection (e.g., fetch one document from a test collection)
    const result = await mongoose.connection.db.collection('capstone').findOne();

    // If no document exists in the 'test' collection, create one
    if (!result) {
      await mongoose.connection.db.collection('capstone').insertOne({ name: 'Test', value: 'This is a test' });
      return new Response('Database connected and test document created', { status: 201 });
    }

    return new Response('Database connection is successful and test document exists', { status: 200 });
  } catch (error) {
    console.error('Error connecting to database:', error);
    return new Response('Failed to connect to the database', { status: 500 });
  }
}
