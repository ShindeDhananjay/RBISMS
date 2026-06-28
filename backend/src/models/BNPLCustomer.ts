import mongoose, { Schema, Document } from 'mongoose';

export interface IBNPLCustomer extends Document {
  // Add interfaces manually if strictly typed
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BNPLCustomerSchema: Schema = new Schema({
  name: {type: String, required: true},
  customerType: String,
  mobile: String,
  email: String,
  customerId: String,
  validity: String,
  productType: String
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IBNPLCustomer>('BNPLCustomer', BNPLCustomerSchema);
