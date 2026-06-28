import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { Role } from '../models/User';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ip-rbisms';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB.');

    const superAdminUsername = 'sdhananjay1299@gmail.com';
    const superAdminPassword = 'shinde@2005';

    // Check if exists
    const existing = await User.findOne({ username: superAdminUsername });
    if (existing) {
      console.log('Super Admin already exists in the database.');
      // Update password just in case
      existing.password = superAdminPassword;
      existing.role = Role.SUPER_ADMIN;
      await existing.save();
      console.log('Super Admin credentials verified/updated.');
    } else {
      const superAdmin = new User({
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
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
