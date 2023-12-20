import { model, Schema } from "mongoose";

const usersSchema = new Schema({
  userId: { type: String, unique: true, require: true },
  auths: [
    {
      channel: { type: String, require: true },
      id: { type: String, require: true },
      secret: {
        bcrypt: { type: String, require: true },
        token: { type: String },
        expireAt: { type: String },
      },
    },
  ],
  emails:
    {
      address: { type: String, unique: true, require: true },
      verified: { type: Boolean },
      token: { type: String },
      expireAt: { type: String },
    },
  phoneNumber: { type: String },
  address: { type: String },
  avatar: {
    firstName: { type: String },
    syrName: { type: String },
    imageUrl: { type: String },
  },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

usersSchema.index({ userId: 1 }, { unique: true });
usersSchema.index({ "emails.address": 1 }, { unique: true });
usersSchema.index({ "auths.channel": 1, "auths.id": 1 }, { unique: true });

export const users = model("users", usersSchema);