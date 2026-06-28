import mongoose, { Schema, Document } from 'mongoose';

export interface ISubOffice extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubOfficeSchema: Schema = new Schema({
  pinCode: {type: String, required: true}, name: {type: String, required: true}, noOfEmployees: {type: Number, default: 0}, status: {type: String, default: 'Active'}
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ISubOffice>('SubOffice', SubOfficeSchema);
