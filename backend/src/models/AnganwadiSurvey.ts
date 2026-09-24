import mongoose, { Schema, Document } from 'mongoose';

export interface IAnganwadiSurvey extends Document {
  villageId?: mongoose.Types.ObjectId;
  nameOfAnganwadi: string;
  nameOfTeacher: string;
  nameOfAssistantTeacher?: string;
  nameOfAshaWorker?: string;
  mobileNumberOfTeacher?: string;
  emailId?: string;
  boName?: string;
  villageName?: string;
  nameOfBpm?: string;
  nameOfAbpm?: string;
  childrenName?: string;
  childrenAge?: string;
  parentsMobNum?: string;
  havingSsaPpfAccount?: string;
  pregnantWomenName?: string;
  pregnantWomenAge?: string;
  matruvandanaAccount?: string;
  gps?: string;
  userId?: mongoose.Types.ObjectId;
  entryBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnganwadiSurveySchema: Schema = new Schema({
  villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },
  nameOfAnganwadi: { type: String, required: true },
  nameOfTeacher: { type: String, required: true },
  nameOfAssistantTeacher: { type: String },
  nameOfAshaWorker: { type: String },
  mobileNumberOfTeacher: { type: String },
  emailId: { type: String },
  boName: { type: String },
  villageName: { type: String },
  nameOfBpm: { type: String },
  nameOfAbpm: { type: String },
  childrenName: { type: String },
  childrenAge: { type: String },
  parentsMobNum: { type: String },
  havingSsaPpfAccount: { type: String },
  pregnantWomenName: { type: String },
  pregnantWomenAge: { type: String },
  matruvandanaAccount: { type: String },
  gps: { type: String }
,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IAnganwadiSurvey>('AnganwadiSurvey', AnganwadiSurveySchema);
