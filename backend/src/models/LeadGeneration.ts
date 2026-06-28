import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadGeneration extends Document {
  leadByBoName?: string;
  nameOfCustomer: string;
  fullAddress?: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  emailId?: string;
  boName?: string;
  soName?: string;
  typeOfLead?: string; // Account Opening/ PLI and RPLI/ Article delivery /Marchant On boarding/ SSA/IPPB/
  resolvedOn?: Date;
  visitedBy?: string;
  status?: string; // e.g., Pending, Follow-up, Converted
  followUpDate?: Date;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadGenerationSchema: Schema = new Schema({
  leadByBoName: { type: String },
  nameOfCustomer: { type: String, required: true },
  fullAddress: { type: String },
  mobileNumber: { type: String, required: true },
  alternateMobileNumber: { type: String },
  emailId: { type: String },
  boName: { type: String },
  soName: { type: String },
  typeOfLead: { type: String },
  resolvedOn: { type: Date },
  visitedBy: { type: String },
  status: { type: String, default: 'Pending' },
  followUpDate: { type: Date }
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ILeadGeneration>('LeadGeneration', LeadGenerationSchema);
