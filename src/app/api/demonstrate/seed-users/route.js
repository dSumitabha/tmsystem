import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function GET(request) {
  try {
    await dbConnect();

    // Sameple user data to make demonstration easy
    const usersData = [
      { fullName: 'Surya Kumar Yadav', email: 'surya@gmail.com', password: 'password123' },
      { fullName: 'Rohit Sharma', email: 'rohit@gmail.com', password: 'password123' },
      { fullName: 'Yusuf Pathan', email: 'yusuf@gmail.com', password: 'password123' },
      { fullName: 'Irfan Pathan', email: 'irfan@gmail.com', password: 'password123' },
      { fullName: 'Robin Uthappa', email: 'robin@gmail.com', password: 'password123' },
      { fullName: 'Murali Vijay', email: 'murali@gmail.com', password: 'password123' },
      { fullName: 'Ravichandran Ashwin', email: 'ravichandran@gmail.com', password: 'password123' },
      { fullName: 'Ajinkya Rahane', email: 'ajinkya@gmail.com', password: 'password123' },
      { fullName: 'Shikhar Dhawan', email: 'shikhar@gmail.com', password: 'password123' },
      { fullName: 'Bhuvneshwar Kumar', email: 'bhuvneshwar@gmail.com', password: 'password123' },

      { fullName: 'Brad Hodge', email: 'brad@gmail.com', password: 'password123' },
      { fullName: 'Matthew Hayden', email: 'matthew@gmail.com', password: 'password123' },
      { fullName: 'Michael Clarke', email: 'michael@gmail.com', password: 'password123' },
      { fullName: 'Shane Watson', email: 'shane@gmail.com', password: 'password123' },
      { fullName: 'Mitchell Johnson', email: 'mitchell@gmail.com', password: 'password123' },
      { fullName: 'Nathan Hauritz', email: 'nathan@gmail.com', password: 'password123' },
      { fullName: 'David Hussey', email: 'david@gmail.com', password: 'password123' },
      { fullName: 'George Bailey', email: 'george@gmail.com', password: 'password123' },
      { fullName: 'Aaron Finch', email: 'aaron@gmail.com', password: 'password123' },
      { fullName: 'James Pattinson', email: 'james@gmail.com', password: 'password123' }
    ];

    // Check if any users already exist
    for (let i = 0; i < usersData.length; i++) {
      const { fullName, email, password } = usersData[i];

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        continue;  
      }

      // hashing the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // creating the user instance
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        isAdmin: false
      });

      await newUser.save();
    }

    return NextResponse.json(
      { message: 'Users seeded successfully' },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Seeding failed', details: error.message },
      { status: 500 }
    );
  }
}
