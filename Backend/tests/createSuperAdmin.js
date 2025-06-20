import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

const createSuperAdmin = async () => {
  try {
    const DB_URI = "mongodb+srv://vijayvardhankilli:dbpass@cluster0.9n8bjiu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    await mongoose.connect(DB_URI); 

    const existing = await User.findOne({ role: 'super-admin' });
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
