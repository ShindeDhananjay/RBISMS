import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { Role } from '../models/User';

dotenv.config();

const wipeAndSeed = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ip-rbisms';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB. Wiping database...');

    // Drop the database
    await mongoose.connection.db?.dropDatabase();
    console.log('Database successfully wiped.');

    // Seed Super Admin
    const superAdminUsername = 'sdhananjay1299@gmail.com';
    const superAdminPassword = 'shinde@2005';

    const superAdmin = new User({
      employeeId: `ADM-${Date.now()}`,
      employeeName: 'Super Admin',
      designation: 'System Administrator',
      mobile: '9999999999',
      username: superAdminUsername,
      password: superAdminPassword,
      role: Role.SUPER_ADMIN,
      status: 'Active'
    });
    
    await superAdmin.save();
    console.log('Super Admin successfully seeded!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error wiping and seeding:', error);
    process.exit(1);
  }
};

wipeAndSeed();
