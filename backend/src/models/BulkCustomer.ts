import mongoose, { Schema, Document } from 'mongoose';

export interface IBulkCustomer extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BulkCustomerSchema: Schema = new Schema({
  name: {type: String, required: true}, bookingVolume: Number, revenue: Number
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IBulkCustomer>('BulkCustomer', BulkCustomerSchema);
