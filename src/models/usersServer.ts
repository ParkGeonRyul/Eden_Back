import { model, Schema } from "mongoose";

const usersSchema = new Schema(
  {
    auths: {
      userData: {
        userId: { type: String, require: true, unique: true },
        userEmail: { type: String, require: true, unique: true },
        token: { type: String },
        expireAt: { type: Date },
      },
      secret: {
        bcrypt: { type: String, require: true },
        token: { type: String },
        expireAt: { type: String },
      },
    },
    avatar: {
      firstName: { type: String, require: true },
      surName: { type: String, require: true },
      userImage: { type: String },
    },
    phoneNumber: { type: String, require: true },
    address: { type: String },
    birthDate : { type: Date },
    isAdmin: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

usersSchema.index({ "auths.userData.userId": 1 }, { unique: true });
usersSchema.index({ "auths.userData.userEmail": 1 }, { unique: true });

export const users = model("users", usersSchema);
