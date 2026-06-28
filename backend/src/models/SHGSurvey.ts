import mongoose, { Schema, Document } from 'mongoose';

export interface ISHGSurvey extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SHGSurveySchema: Schema = new Schema({
  villageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Village'}, shgName: String, membersCount: Number, totalSavings: Number
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ISHGSurvey>('SHGSurvey', SHGSurveySchema);
