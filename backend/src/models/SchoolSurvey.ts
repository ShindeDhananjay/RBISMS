import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolSurvey extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSurveySchema: Schema = new Schema({
  villageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Village'}, schoolName: String, studentCount: Number, staffCount: Number
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ISchoolSurvey>('SchoolSurvey', SchoolSurveySchema);
