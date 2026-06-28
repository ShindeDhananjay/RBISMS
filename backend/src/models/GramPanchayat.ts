import mongoose, { Schema, Document } from 'mongoose';

export interface IGramPanchayat extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GramPanchayatSchema: Schema = new Schema({
  villageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Village'}, sarpanchName: String, gramSevakName: String
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IGramPanchayat>('GramPanchayat', GramPanchayatSchema);
