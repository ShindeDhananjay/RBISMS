import mongoose, { Schema, Document } from 'mongoose';

export interface IBranchOffice extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BranchOfficeSchema: Schema = new Schema({
  name: {type: String, required: true}, 
  subOfficeId: {type: mongoose.Schema.Types.ObjectId, ref: 'SubOffice'},
  subOfficeName: String,
  post: String,
  pincode: String,
  bpmName: String, 
  latitude: String, 
  longitude: String, 
  status: {type: String, default: 'single handed'}
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IBranchOffice>('BranchOffice', BranchOfficeSchema);
