import { model, Schema } from "mongoose";

//메뉴바 번호 부여된 순서대로 함. 단, 9번은 메인페이지
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
