import mongoose, { Schema, Document } from 'mongoose';

export interface ISubDivision extends Document {
  employeeName: string;
  designation: string;
  postingOffice: string;
  pranNumber?: string;
  dnOfficeName?: string;
  dateOfBirth?: Date;
  bloodGroup?: string;
  hobby?: string;
  sportsActivities?: string;
  education?: string;
  culturalActivities?: string;
  dateOfAppointment?: Date;
  dateOfPromotion?: Date;
  typeOfPromotion?: string;
  macp1?: Date;
  macp2?: Date;
  macp3?: Date;
  punishmentDetails?: string;
  dateOfRetirement?: Date;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  historicalOfficePosting?: string;
  postingDate?: Date;
  transferPostingOffice?: string;
  dateOfTransfer?: Date;
  adharTraining?: string;
  marketingTraining?: string;
  pliTraining?: string;
  pliIdNo?: string;
  inductionTraining?: string;
  ippbTraining?: string;
  awards?: string;
  salaryTakenFrom?: string;
  userId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubDivisionSchema: Schema = new Schema({
  employeeName: { type: String, required: true },
  designation: { type: String, required: true },
  postingOffice: { type: String, required: true },
  pranNumber: { type: String },
  dnOfficeName: { type: String },
  dateOfBirth: { type: Date },
  bloodGroup: { type: String },
  hobby: { type: String },
  sportsActivities: { type: String },
  education: { type: String },
  culturalActivities: { type: String },
  dateOfAppointment: { type: Date },
  dateOfPromotion: { type: Date },
  typeOfPromotion: { type: String },
  macp1: { type: Date },
  macp2: { type: Date },
  macp3: { type: Date },
  punishmentDetails: { type: String },
  dateOfRetirement: { type: Date },
  mobile: { type: String, required: true },
  alternateMobile: { type: String },
  email: { type: String },
  historicalOfficePosting: { type: String },
  postingDate: { type: Date },
  transferPostingOffice: { type: String },
  dateOfTransfer: { type: Date },
  adharTraining: { type: String },
  marketingTraining: { type: String },
  pliTraining: { type: String },
  pliIdNo: { type: String },
  inductionTraining: { type: String },
  ippbTraining: { type: String },
  awards: { type: String },
  salaryTakenFrom: { type: String }
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ISubDivision>('SubDivision', SubDivisionSchema);
