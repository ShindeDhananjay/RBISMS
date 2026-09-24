import mongoose, { Schema, Document } from 'mongoose';

export interface IFranchisee extends Document {
  nameOfFranchiseeOwner: string;
  address?: string;
  mobileNumber: string;
  emailId?: string;
  franchiseeLicenseNumber?: string;
  dateOfIssue?: Date;
  dateOfExpiry?: Date;
  userId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FranchiseeSchema: Schema = new Schema({
  nameOfFranchiseeOwner: { type: String, required: true },
  address: { type: String },
  mobileNumber: { type: String, required: true },
  emailId: { type: String },
  franchiseeLicenseNumber: { type: String },
  dateOfIssue: { type: Date },
  dateOfExpiry: { type: Date }
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IFranchisee>('Franchisee', FranchiseeSchema);
