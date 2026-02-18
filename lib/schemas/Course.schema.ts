import { Model, Document } from "mongoose";
import { TypesObjectId } from ".";

export interface ICourse {
  title: string;
  description: string;
  createdDate: Date;
  status: string;
  createdBy: TypesObjectId;
}
export interface ICourseDoc extends ICourse, Document {
  _id: TypesObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type ICourseModel = Model<ICourseDoc>;
