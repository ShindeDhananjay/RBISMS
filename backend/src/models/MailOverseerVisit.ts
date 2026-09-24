import mongoose, { Schema, Document } from 'mongoose';

export interface IMailOverseerVisit extends Document {
  beatNumber: string;
  boName: string;
  subOfficeName: string;
  dateOfVisit: Date;
  resultOfVisit: string;
  userId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MailOverseerVisitSchema: Schema = new Schema({
  beatNumber: { type: String, required: true },
  boName: { type: String, required: true },
  subOfficeName: { type: String, required: true },
  dateOfVisit: { type: Date, required: true },
  resultOfVisit: { type: String }
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IMailOverseerVisit>('MailOverseerVisit', MailOverseerVisitSchema);
