import mongoose, { Schema, Document } from 'mongoose';

export interface ISelfHelpGroup extends Document {
  soName: string;
  boName: string;
  villageName: string;
  shgName: string;
  contactNumber: string;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SelfHelpGroupSchema: Schema = new Schema({
  soName: { type: String, required: true },
  boName: { type: String, required: true },
  villageName: { type: String, required: true },
  shgName: { type: String, required: true },
  contactNumber: { type: String }
,
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<ISelfHelpGroup>('SelfHelpGroup', SelfHelpGroupSchema);
