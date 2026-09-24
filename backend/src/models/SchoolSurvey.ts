import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolSurvey extends Document {
  // Add interfaces manually if strictly typed
  userId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSurveySchema: Schema = new Schema({
  villageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Village'}, schoolName: String, studentCount: Number, staffCount: Number
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ISchoolSurvey>('SchoolSurvey', SchoolSurveySchema);
