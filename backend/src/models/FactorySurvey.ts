import mongoose, { Schema, Document } from 'mongoose';

export interface IFactorySurvey extends Document {
  // Add interfaces manually if strictly typed
  userId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FactorySurveySchema: Schema = new Schema({
  villageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Village'}, factoryName: String, employeeCount: Number, dispatchVolume: String
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IFactorySurvey>('FactorySurvey', FactorySurveySchema);
