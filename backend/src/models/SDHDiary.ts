import mongoose, { Schema, Document } from 'mongoose';

export interface ISDHDiary extends Document {
  date: Date;
  from: string;
  fromTime?: string;
  to: string;
  toTime?: string;
  distance: number;
  purposeOfVisit: string;
  userId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SDHDiarySchema: Schema = new Schema({
  date: { type: Date, required: true },
  from: { type: String, required: true },
  fromTime: { type: String },
  to: { type: String, required: true },
  toTime: { type: String },
  distance: { type: Number },
  purposeOfVisit: { type: String }
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ISDHDiary>('SDHDiary', SDHDiarySchema);
