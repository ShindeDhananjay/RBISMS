import mongoose, { Schema, Document } from 'mongoose';

export interface IBulkCustomer extends Document {
  // Add interfaces manually if strictly typed
  userId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BulkCustomerSchema: Schema = new Schema({
  name: {type: String, required: true}, bookingVolume: Number, revenue: Number
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IBulkCustomer>('BulkCustomer', BulkCustomerSchema);
