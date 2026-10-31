import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
    }

    await connectDB();

    let admin = await User.findOne({ email }).select('+password');

    if (admin) {
      admin.role = 'admin';
      admin.isActive = true;
      
      await admin.save();

      console.log('Existing user promoted to admin:', email);
    } else {
      admin = await User.create({
        name: 'Halla Bol Admin',
        email,
        password,
        role: 'admin',
        isActive: true,
      });

      console.log('Admin account created:', email);
    }

    process.exitCode = 0;
  } catch (error) {
    console.error('Admin setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    const mongoose = await import('mongoose');
    await mongoose.default.disconnect();
  }
};

seedAdmin();
