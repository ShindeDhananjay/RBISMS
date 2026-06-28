import mongoose, { Schema, Document } from 'mongoose';

export interface IBuildingMaintenance extends Document {
  nameOfPostOffice: string;
  buildingType?: string;
  nameOfOwner?: string;
  mobileNumber?: string;
  emailNumber?: string;
  gatNumber0712?: string;
  citySurveyNumber?: string;
  bathroom?: string;
  storeRoom?: string;
  customerAreaSqMt?: number;
  noOfCounters?: number;
  totalAreaInSqFt?: number;
  monthlyRent?: number;
  lastLeaseDeedCompletedOn?: Date;
  dateOfRenewal?: Date;
  dateOfExpiryOfLeaseDeed?: Date;
  correspondingAddressOfOwner?: string;
  treasuryEmbodied?: string;
  lastDateOfColorOfBuilding?: Date;
  requirementOfFurnitureFromOwner?: string;
  lastDateOfSanitizationOfBuilding?: Date;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BuildingMaintenanceSchema: Schema = new Schema({
  nameOfPostOffice: { type: String, required: true },
  buildingType: { type: String },
  nameOfOwner: { type: String },
  mobileNumber: { type: String },
  emailNumber: { type: String },
  gatNumber0712: { type: String },
  citySurveyNumber: { type: String },
  bathroom: { type: String, enum: ['Yes', 'No'] },
  storeRoom: { type: String, enum: ['Yes', 'No'] },
  customerAreaSqMt: { type: Number },
  noOfCounters: { type: Number },
  totalAreaInSqFt: { type: Number },
  monthlyRent: { type: Number },
  lastLeaseDeedCompletedOn: { type: Date },
  dateOfRenewal: { type: Date },
  dateOfExpiryOfLeaseDeed: { type: Date },
  correspondingAddressOfOwner: { type: String },
  treasuryEmbodied: { type: String, enum: ['Yes', 'No'] },
  lastDateOfColorOfBuilding: { type: Date },
  requirementOfFurnitureFromOwner: { type: String },
  lastDateOfSanitizationOfBuilding: { type: Date }
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IBuildingMaintenance>('BuildingMaintenance', BuildingMaintenanceSchema);
