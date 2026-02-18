import { model, Schema } from "mongoose";
import { Status, userRole } from "../enums";
import { IUserDoc, IUserModel } from "../schemas";

const UserSchema = new Schema<IUserDoc>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: userRole.STUDENT,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    dateJoined: {
      type: Date,
      default: Date.now(),
    },
    attempt: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);
export const User = model<IUserDoc, IUserModel>("User", UserSchema, "users");
