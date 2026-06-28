import mongoose, { Schema, Document } from 'mongoose';

export interface IHospitalSurvey extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSurveySchema: Schema = new Schema({
  villageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Village'}, hospitalName: String, doctorCount: Number, bedCount: Number
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IHospitalSurvey>('HospitalSurvey', HospitalSurveySchema);
