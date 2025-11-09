import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import path from 'path';
import fs from 'fs';

export async function GET(request) {
  try {
    await dbConnect();

    const usersFilePath = path.resolve('src/data', 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    // Sameple user data to make demonstration easy
    

    // Check if any users already exist
    for (let i = 0; i < usersData.length; i++) {
      const { fullName, email, password, isAdmin } = usersData[i];

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
        isAdmin: isAdmin === 'true' ? true : false
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
