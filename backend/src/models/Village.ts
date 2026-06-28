import mongoose, { Schema, Document } from 'mongoose';

export interface IVillage extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VillageSchema: Schema = new Schema({
  name: {type: String, required: true}, 
  code: String, 
  censusCode: String, 
  branchOfficeId: {type: mongoose.Schema.Types.ObjectId, ref: 'BranchOffice'}, 
  population: Number, 
  households: Number, 
  farmers: Number, 
  businessPotentialScore: Number, 
  latitude: String, 
  longitude: String,
  boName: String,
  pincode: String,
  sarpanchName: String,
  sarpanchMobile: String,
  anganwadiSevikaName: String,
  anganwadiMobile: String,
  ashaWorkerName: String,
  policePatilName: String,
  talathiName: String,
  gramsewakName: String
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IVillage>('Village', VillageSchema);
