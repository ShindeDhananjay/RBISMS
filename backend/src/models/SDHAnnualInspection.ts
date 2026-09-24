import mongoose, { Schema, Document } from 'mongoose';

export interface ISDHAnnualInspection extends Document {
  officeName: string;
  dli: Date;
  classOfOffice: string;
  dateOfInspection?: Date;
  status?: string;
  userId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SDHAnnualInspectionSchema: Schema = new Schema({
  officeName: { type: String, required: true },
  dli: { type: Date, required: true },
  classOfOffice: { type: String, required: true },
  dateOfInspection: { type: Date },
  status: { type: String, enum: ['Pending', 'Completed', 'pending', 'completed'], default: 'Pending' }
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ISDHAnnualInspection>('SDHAnnualInspection', SDHAnnualInspectionSchema);
