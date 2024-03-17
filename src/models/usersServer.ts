import { model, Schema } from "mongoose";
interface User {
  auths: {
    userData: {
      userId: String;
      userEmail: String;
      token: String;
      expireAt: Date;
    };
    secret: {
      bcrypt: String;
      token: String;
      expireAt: String;
    };
  };
  avatar: {
    firstName: String;
    surName: String;
    userImage: String;
  };
  phoneNumber: String;
  address: String;
  birthDate: Date;
  isAdmin: Boolean;
}

interface EmailAuth {
  email: String,
  token: String,
  createdAt: Date
}
const usersSchema = new Schema<User>(
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
    birthDate: { type: Date },
    isAdmin: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const emailAuthSchema = new Schema<EmailAuth>(
  {
    email : { type: String, require: true },
    token : { type: String, require: true},
    createdAt : { type: Date, expires: 600, default: Date.now }
  }
);

usersSchema.index({ "auths.userData.userId": 1 }, { unique: true });
usersSchema.index({ "auths.userData.userEmail": 1 }, { unique: true });

export const users = model<User>("users", usersSchema);
export const emailAuth = model<EmailAuth>("emailAuth", emailAuthSchema);
