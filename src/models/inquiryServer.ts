import { model, Schema } from "mongoose";

const inquirysSchema = new Schema(
  {
    auths: {
      userName: { type: String, require: true },
      userEmail: { type: String, require: true },
    },
    category: { type: Number, require: true },
    content: { type: String, require: true },
    answer: { type: String },
    inquiryId: { type: String },
    inquiryCreatedAt: { type: Date },
    reviewUpdatedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: "inquiryCreatedAt",
      updatedAt: "reviewUpdatedAt",
    },
  }
);

inquirysSchema.index({ "auths.userEmail": 1 }, { unique: true });

export const inquiry = model("inquirys", inquirysSchema);
