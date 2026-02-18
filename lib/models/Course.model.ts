import { model, Schema } from "mongoose";
import { ICourseDoc, ICourseModel } from "../schemas";
import { Status } from "../enums";

const CourseSchema = new Schema<ICourseDoc>(
  {
    createdBy: {
      type: "ObjectID",
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
  },
  {
    id: false,
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  }
);
export const Course = model<ICourseDoc, ICourseModel>(
  "Course",
  CourseSchema,
  "courses"
);
