import mongoose, { Schema, Document } from 'mongoose';

export interface IParcelMonitoring extends Document {
  nameOfSubOffice?: string;
  nameOfBo?: string;
  parcelNo: string;
  fromAddress?: string;
  toAddress?: string;
  mobileNumberOfCustomer?: string;
  userId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParcelMonitoringSchema: Schema = new Schema({
  nameOfSubOffice: { type: String },
  nameOfBo: { type: String },
  parcelNo: { type: String, required: true },
  fromAddress: { type: String },
  toAddress: { type: String },
  mobileNumberOfCustomer: { type: String }
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IParcelMonitoring>('ParcelMonitoring', ParcelMonitoringSchema);
