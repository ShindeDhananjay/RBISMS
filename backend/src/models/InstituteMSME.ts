import mongoose, { Schema, Document } from 'mongoose';

export interface IInstituteMSME extends Document {
  nameOfCompany: string;
  nameOfOwner: string;
  address: string;
  fullName: string;
  productionType: string;
  numOfEmployees: number;
  userId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InstituteMSMESchema: Schema = new Schema({
  nameOfCompany: { type: String, required: true },
  nameOfOwner: { type: String },
  address: { type: String },
  fullName: { type: String },
  productionType: { type: String },
  numOfEmployees: { type: Number }
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IInstituteMSME>('InstituteMSME', InstituteMSMESchema);
