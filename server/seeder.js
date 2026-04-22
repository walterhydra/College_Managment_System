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
      email: 'admin@2026.com',
      password: '220305@Admin',
      role: 'admin',
    });
    await adminUser.save();

    const staffUser = new User({
      email: 'staff@erp.com',
      password: '123456',
      role: 'staff',
    });
    await staffUser.save();

    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const departments = ['Computer Science', 'Mechanical Engineering', 'Civil Engineering', 'Electronics', 'Information Technology'];
    const programs = ['BTech - CSE', 'BTech - Mechanical', 'BTech - Civil', 'BTech - Electronics', 'BTech - IT'];
    const batches = ['2020-2024', '2021-2025', '2022-2026', '2023-2027'];
    
    const students = [];
    for (let i = 1; i <= 50; i++) {
      students.push({
        email: `student${i}@erp.com`,
        password: 'password',
        role: 'student'
      });
    }
    const insertedStudents = await User.insertMany(students);

    const studentProfiles = insertedStudents.map((student, index) => {
      const deptIndex = index % departments.length;
      return {
        user: student._id,
        firstName: firstNames[index % firstNames.length],
        lastName: lastNames[(index + 3) % lastNames.length], // offset to mix names
        enrollmentNo: `1904101${(1000 + index).toString()}`,
        program: programs[deptIndex],
        semester: (index % 8) + 1,
        batch: batches[index % batches.length],
        department: departments[deptIndex],
        phone: `987654${(3000 + index).toString()}`
      };
    });

    const insertedStudentProfiles = await Profile.insertMany(studentProfiles);

    // Update users with profile IDs
    for (let i = 0; i < insertedStudents.length; i++) {
      insertedStudents[i].profile = insertedStudentProfiles[i]._id;
      await insertedStudents[i].save();
    }

    const alumniUser = new User({
      email: 'alumni@erp.com',
      password: '123456',
      role: 'alumni',
    });
    await alumniUser.save();


    const adminProfile = await Profile.create({
        user: adminUser._id,
        firstName: 'System',
        lastName: 'Admin',
    });
    adminUser.profile = adminProfile._id;
    await adminUser.save();
    const staffProfile = await Profile.create({
        user: staffUser._id,
        firstName: 'Prof.',
        lastName: 'Smith',
    });
    staffUser.profile = staffProfile._id;
    await staffUser.save();
    const alumniProfile = await Profile.create({
        user: alumniUser._id,
        firstName: 'Jane',
        lastName: 'Doe',
        enrollmentNo: '180410101010',
        program: 'BTech - CSE',
        batch: '2020-2024',
    });
    alumniUser.profile = alumniProfile._id;
    await alumniUser.save();

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
