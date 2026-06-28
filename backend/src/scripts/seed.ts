import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from '../models/User';
import VillageModel from '../models/Village';
import LeadGenerationModel from '../models/LeadGeneration';
import FranchiseeModel from '../models/Franchisee';
import SubDivisionModel from '../models/SubDivision';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ip-rbisms';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await UserModel.deleteMany({});
    await VillageModel.deleteMany({});
    await LeadGenerationModel.deleteMany({});
    await FranchiseeModel.deleteMany({});
    await SubDivisionModel.deleteMany({});

    // Seed Villages
    const villages = await VillageModel.insertMany([
      { name: 'Shevgaon Main', code: 'MH-SHV-01', population: 45000, businessScore: 85, status: 'Active' },
      { name: 'Pathardi Rural', code: 'MH-PTH-02', population: 22000, businessScore: 65, status: 'Active' },
      { name: 'Nevasa', code: 'MH-NEV-03', population: 31000, businessScore: 92, status: 'Active' },
      { name: 'Jamkhed', code: 'MH-JAM-04', population: 15000, businessScore: 45, status: 'Inactive' },
    ]);
    console.log('Seeded Villages:', villages.length);

    // Seed Employees (Users)
    const employees = await UserModel.insertMany([
      { employeeName: 'Ramesh Patil', designation: 'Postmaster', postingOffice: 'Shevgaon', dnOfficeName: 'Ahmednagar', mobile: '9876543210' },
      { employeeName: 'Suresh Kumar', designation: 'Gramin Dak Sevak', postingOffice: 'Pathardi', dnOfficeName: 'Ahmednagar', mobile: '9123456780' },
    ]);
    console.log('Seeded Employees:', employees.length);

    // Seed Franchisees
    const franchisees = await FranchiseeModel.insertMany([
      { nameOfFranchiseeOwner: 'Rajesh G.', mobileNumber: '8877665544', address: 'Shevgaon', franchiseeLicenseNumber: 'CSC-01' },
      { nameOfFranchiseeOwner: 'Sunil M.', mobileNumber: '9988776655', address: 'Nevasa', franchiseeLicenseNumber: 'BC-02' },
    ]);
    console.log('Seeded Franchisees:', franchisees.length);

    // Seed Sub Division Employees
    const subDivisions = await SubDivisionModel.insertMany([
      { employeeName: 'Amit Verma', designation: 'Inspector of Posts', postingOffice: 'Ahmednagar H.O', mobile: '9988112233', pranNumber: '110099887766' },
      { employeeName: 'Neha Sharma', designation: 'Postmaster', postingOffice: 'Shevgaon', mobile: '9911223344', pranNumber: '110022334455' }
    ]);
    console.log('Seeded Sub Division Employees:', subDivisions.length);

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Error Seeding Database:', error);
    process.exit(1);
  }
};

seedDatabase();
