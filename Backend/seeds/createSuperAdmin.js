import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import User from '../models/user.model.js';

config({ path: '.env' });

const createSuperAdmin = async () => {
  try {
    const DB_URI = process.env.DB_URI;
    if (!DB_URI) {
      throw new Error('DB_URI is not set. Create a .env file (see .env.example).');
    }
    await mongoose.connect(DB_URI); 

    const existing = await User.findOne({ role: 'superadmin' });
    if (existing) {
      console.log('❗ Super Admin already exists:', existing.email);
      return process.exit(0);
    }

    const SALT = await bcrypt.genSalt(10);
    const password = 'superadmin123';
    const hashedPassword = await bcrypt.hash(password , SALT);

    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@road.com',
      password: hashedPassword,
      role: 'superadmin',
    });

    console.log('✅ Super Admin created:', superAdmin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createSuperAdmin();
