import mongoose, { model, Schema, Types } from "mongoose";
// @ts-ignore
const AutoIncrement = require("mongoose-sequence")(mongoose);

interface Post {
  _id: Types.ObjectId;
  postId: number;
  title: string;
  content: string;
  uploadFile: [{ fileUrl: string }];
  isSign: boolean;
  language: number;
  view: number;
  category: number;
}

const postsSchema = new Schema<Post>(
  {
    postId: { type: Number, require: true },
    title: { type: String, require: true },
    content: { type: String, require: true },
    uploadFile: [
      {
        fileUrl: { type: String },
      },
    ],
    isSign: { type: Boolean, require: true },
    language: { type: Number, require: true }, // 0 korean  1 English  2 Spanish
    view: { type: Number, default: 1 },
    category: { type: Number, require: true },
  },
  {
    timestamps: {
      currentTime: () => new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
    versionKey: false,
  }
);

postsSchema.plugin(AutoIncrement, { inc_field: "postId" });
postsSchema.index({ postId: 1 }, { unique: true });

export const posts = model<Post>("posts", postsSchema);
