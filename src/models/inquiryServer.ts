import { model, Schema } from "mongoose";

interface Inquiry {
  auths: {
    userName: string;
    userEmail: string;
  };
  category: number;
  title: string;
  content: string;
  answer: string;
  inquiryId: string;
  inquiryCreatedAt: Date;
  reviewUpdatedAt: Date;
}

const inquirySchema = new Schema<Inquiry>(
  {
    auths: {
      userName: { type: String, require: true },
      userEmail: { type: String, require: true },
    },
    category: { type: Number, require: true },
    title: { type: String, require: true },
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
      currentTime: () => new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
  }
);

export const inquiry = model<Inquiry>("inquiry", inquirySchema); // [mongoose] 모델 이름 단수형 사용시 자동으로 복수형으로 변환되어 컬렉션 생성 (inquiry -> inquiries)
