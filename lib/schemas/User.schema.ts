import { Model, Document } from "mongoose";
import { TypesObjectId } from ".";

export interface IUser {
  name: string;
  email: string;
  role: string;
  password: string;
  status: string;
  dateJoined: Date;
  attempt: number;
  isLocked?: boolean;
  lockUntil?: Date;
}

export interface IUserDoc extends IUser, Document {
  _id: TypesObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserModel = Model<IUserDoc>;
