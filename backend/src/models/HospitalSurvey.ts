import mongoose, { Schema, Document } from 'mongoose';

export interface IHospitalSurvey extends Document {
  // Add interfaces manually if strictly typed
  userId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSurveySchema: Schema = new Schema({
  villageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Village'}, hospitalName: String, doctorCount: Number, bedCount: Number
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IHospitalSurvey>('HospitalSurvey', HospitalSurveySchema);
