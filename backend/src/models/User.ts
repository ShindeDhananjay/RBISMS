import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum Role {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  CIRCLE_ADMIN = 'Circle Admin',
  DIVISION_ADMIN = 'Division Admin',
  INSPECTOR = 'Inspector',
  POSTMASTER = 'Postmaster',
  BPM = 'BPM',
  ABPM = 'ABPM',
  MARKETING_EXECUTIVE = 'Marketing Executive',
  USER = 'User'
}

export interface IUser extends Document {
  employeeId?: string;
  employeeCategory?: string;
  employeeName: string;
  designation: string;
  officeName?: string;
  postingOffice?: string;
  dnOfficeName?: string;
  hoName?: string;
  subOfficeName?: string;
  division?: string;
  subDivision?: string;
  bo?: string;
  mobile: string;
  email?: string;
  username?: string;
  password?: string;
  role?: Role;
  status: 'Active' | 'Inactive' | 'Locked';
  lastLogin?: Date;
  otp?: string;
  otpExpiry?: Date;
  accessibleModules?: string[];
  createdBy?: mongoose.Schema.Types.ObjectId | IUser;
  initialPassword?: string;
  
  // Employee Master Additional Fields
  dateOfBirth?: Date;
  bloodGroup?: string;
  hobby?: string;
  sportsActivities?: string;
  education?: string;
  culturalActivities?: string;
  dateOfAppointment?: Date;
  dateOfPromotion?: Date;
  typeOfPromotion?: string;
  macp1?: Date;
  macp2?: Date;
  macp3?: Date;
  punishmentDetails?: string;
  dateOfRetirement?: Date;
  alternateMobile?: string;
  historicalOfficePosting?: string;
  postingDate?: Date;
  transferPostingOffice?: string;
  dateOfTransfer?: Date;
  adharTraining?: string;
  marketingTraining?: string;
  pliTraining?: string;
  pliIdNo?: string;
  inductionTraining?: string;
  ippbTraining?: string;
  awards?: string;
  salaryTakenFrom?: string;
  rule3Chances?: string;
  pranNumber?: string;
}

const UserSchema: Schema = new Schema({
  employeeId: { type: String },
  employeeCategory: { type: String },
  employeeName: { type: String, required: true },
  designation: { type: String, required: true },
  officeName: { type: String },
  postingOffice: { type: String },
  dnOfficeName: { type: String },
  hoName: { type: String },
  subOfficeName: { type: String },
  division: { type: String },
  subDivision: { type: String },
  bo: { type: String },
  mobile: { type: String, required: true },
  email: { type: String },
  username: { type: String },
  password: { type: String },
  role: { type: String, enum: Object.values(Role) },
  status: { type: String, enum: ['Active', 'Inactive', 'Locked'], default: 'Active' },
  lastLogin: { type: Date },
  otp: { type: String },
  otpExpiry: { type: Date },
  accessibleModules: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  initialPassword: { type: String },
  
  // Employee Master Additional Fields
  dateOfBirth: { type: Date },
  bloodGroup: { type: String },
  hobby: { type: String },
  sportsActivities: { type: String },
  education: { type: String },
  culturalActivities: { type: String },
  dateOfAppointment: { type: Date },
  dateOfPromotion: { type: Date },
  typeOfPromotion: { type: String },
  macp1: { type: Date },
  macp2: { type: Date },
  macp3: { type: Date },
  punishmentDetails: { type: String },
  dateOfRetirement: { type: Date },
  alternateMobile: { type: String },
  historicalOfficePosting: { type: String },
  postingDate: { type: Date },
  transferPostingOffice: { type: String },
  dateOfTransfer: { type: Date },
  adharTraining: { type: String },
  marketingTraining: { type: String },
  pliTraining: { type: String },
  pliIdNo: { type: String },
  inductionTraining: { type: String },
  ippbTraining: { type: String },
  awards: { type: String },
  salaryTakenFrom: { type: String },
  rule3Chances: { type: String },
  pranNumber: { type: String }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(this: any) {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

export default mongoose.model<IUser>('User', UserSchema);
