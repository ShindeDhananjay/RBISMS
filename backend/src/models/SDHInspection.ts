import mongoose, { Schema, Document } from 'mongoose';

export interface ISDHInspection extends Document {
  officeName: string;
  dli: Date;
  dateOfInspection?: Date;
  result?: string;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SDHInspectionSchema: Schema = new Schema({
  officeName: { type: String, required: true },
  dli: { type: Date, required: true },
  dateOfInspection: { type: Date },
  result: { type: String },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ISDHInspection>('SDHInspection', SDHInspectionSchema);
