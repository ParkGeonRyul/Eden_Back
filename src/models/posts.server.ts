import { model, Schema } from "mongoose";

const postsSchema = new Schema({
  content: { type: String, require: true },
  uploadFile: [{
    fileUrl: { type: String }
  }],
  isSign: { type: Boolean, require: true},
  language: { type: String, require: true},
  category: { type: Number, require: true},
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

postsSchema.index({ "content": 1 }, { unique: true });

export const posts = model("posts", postsSchema);