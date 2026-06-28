import mongoose, { Schema, Document } from 'mongoose';

export interface IInstituteMSME extends Document {
  nameOfCompany: string;
  nameOfOwner: string;
  address: string;
  fullName: string;
  productionType: string;
  numOfEmployees: number;
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
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IInstituteMSME>('InstituteMSME', InstituteMSMESchema);
