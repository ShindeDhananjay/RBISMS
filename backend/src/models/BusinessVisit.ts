import mongoose, { Schema, Document } from 'mongoose';

export interface IBusinessVisit extends Document {
  // Add interfaces manually if strictly typed
  userId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessVisitSchema: Schema = new Schema({
  visitDate: Date,
  station: String,
  visitType: String,
  visitedBy: String,
  contactPerson: String,
  mobileNumber: String,
  emailId: String,
  followUpBy: String,
  followUpDate: Date,
  status: { type: String, enum: ['Complete', 'Pending'], default: 'Pending' }
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IBusinessVisit>('BusinessVisit', BusinessVisitSchema);
