import mongoose, { Schema, Document } from 'mongoose';

export interface IBankSurvey extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BankSurveySchema: Schema = new Schema({
  villageId: {type: mongoose.Schema.Types.ObjectId, ref: 'Village'}, bankName: String, branchDetails: String, salaryAccounts: Number
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IBankSurvey>('BankSurvey', BankSurveySchema);
