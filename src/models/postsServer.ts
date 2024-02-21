import { model, Schema } from "mongoose";

const postsSchema = new Schema(
  {
    content: { type: String, require: true },
    uploadFile: [
      {
        fileUrl: { type: String },
      },
    ],
    isSign: { type: Boolean, require: true },
    language: { type: String, require: true },
    view: { type: Number },
    category: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);

postsSchema.index({ content: 1 }, { unique: true });

export const posts = model("posts", postsSchema);
