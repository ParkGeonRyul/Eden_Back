import { model, Schema } from "mongoose";

const pageViewsSchema = new Schema({
  today: { type: Date, require: true },
  totalView: { type: Date },
  petView: { type: Date },
  familyView: { type: Date },
  childView: { type: Date},
  sportView: { type: Date }
});

pageViewsSchema.index({ "today": 1 }, { unique: true });

export const pageView = model("pageviews", pageViewsSchema);