import { model, Schema } from "mongoose";

const pageViewsSchema = new Schema({
  today: { type: String, require: true },
  9: { type: Number },
  1: { type: Number },
  2: { type: Number },
  3: { type: Number },
  4: { type: Number },
  5: { type: Number },
});

pageViewsSchema.index({ today: 1 }, { unique: true });

export const pageView = model("pageviews", pageViewsSchema);
