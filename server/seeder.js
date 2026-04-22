import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Profile from './models/Profile.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Profile.deleteMany();

    const adminUser = new User({
      email: 'admin@erp.com',
      password: 'admin123',
      role: 'admin',
    });
    await adminUser.save();

    const staffUser = new User({
      email: 'staff@erp.com',
      password: '123456',
      role: 'staff',
    });
    await staffUser.save();

    const studentUser = new User({
      email: 'student@erp.com',
      password: '123456',
      role: 'student',
    });
    await studentUser.save();

    const alumniUser = new User({
      email: 'alumni@erp.com',
      password: '123456',
      role: 'alumni',
    });
    await alumniUser.save();

    // Profiles
    await Profile.create([
      {
        user: studentUser._id,
        firstName: 'Milan',
        lastName: 'Patel',
        enrollmentNo: '190410101010',
        program: 'BTech - CSE',
        semester: 8,
        batch: '2021-2025',
        phone: '9876543210',
      },
      {
        user: adminUser._id,
        firstName: 'System',
        lastName: 'Admin',
      },
      {
        user: staffUser._id,
        firstName: 'Prof.',
        lastName: 'Smith',
      },
      {
        user: alumniUser._id,
        firstName: 'Jane',
        lastName: 'Doe',
        enrollmentNo: '180410101010',
        program: 'BTech - CSE',
        batch: '2020-2024',
      }
    ]);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
