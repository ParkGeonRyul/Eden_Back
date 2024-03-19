import bcrypt from "bcrypt";
import { emailAuth, users } from "../../models/usersServer";
import {
  InternalServerError,
  fetchError,
  InvalidPropertyError,
  DuplicatePropertyError,
  NotFoundDataError,
} from "../../utils/cunstomError";
import { generateRandom, transporter } from "../../utils/email";

interface MailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  html: string;
}

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;

  return await bcrypt.hash(password, saltRounds);
};

export const getUserById = async (id: string) => {
  const user = await users.findOne({
    "auths.userData.userId": id,
  });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await users.findOne({
    "auths.userData.userEmail": email,
  });
  return user;
};

export const signUp = async (
  id: string,
  email: string,
  password: string,
  firstName: string,
  surName: string,
  phoneNumber: string
) => {
  const emailRegex =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  const passwordRegex = /^(?=.{8,15})/;

  if (!emailRegex.test(email)) {
    throw new Error("Email");
  }

  if (!passwordRegex.test(password)) {
    throw new InvalidPropertyError("Password");
  }
  const hashedPassword: string = await hashPassword(password);

  if (await getUserById(id)) {
    throw new DuplicatePropertyError("ID.");
  }

  if (await getUserByEmail(email)) {
    throw new DuplicatePropertyError("Email.");
  }

  const user = new users({
    auths: {
      userData: {
        userId: id,
        userEmail: email,
      },
      secret: {
        bcrypt: hashedPassword,
      },
    },

    avatar: {
      firstName: firstName,
      surName: surName,
    },

    phoneNumber: phoneNumber,
  });

  return user
    .save()
    .then(() => {
      console.log("User saved successfully:");
    })
    .catch((error) => {
      throw new InternalServerError();
    });
};

export const signIn = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new NotFoundDataError("ID");
  }

  const result = await bcrypt.compare(
    password.toString(),
    user?.auths?.secret?.bcrypt!.toString()
  );

  if (!result) {
    throw new InvalidPropertyError("Password.");
  }

  return user;
};

export const emailAuthService = async (email: string) => {
  const verifiedEmail = await getUserByEmail(email);
  const findEmailAuth = await emailAuth.findOne({ email: email });

  if (verifiedEmail) {
    throw new DuplicatePropertyError("Email.");
  }

  if (findEmailAuth) {
    await emailAuth.deleteOne({ email: email });
  }

  const randomNumber = String(generateRandom(111111, 999999));

  await emailAuth.create({
    email: email,
    token: randomNumber,
  });

  const mailOptions: MailOptions = {
    from: process.env.USERCODE,
    to: email,
    subject: "Bon Dia - Email Authentication",
    html: `<h1>This code is valid for 10 minutes.<h1><br><h2>${randomNumber}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(new fetchError("NodeMailer Server Error"));
      } else {
        resolve(info);
      }
    });
  });
};

export const emailConfirm = async (email: string, token: string) => {
  const findEmail = await emailAuth.findOne({ email: email });
  console.log(findEmail?.token);

  if (!findEmail || token !== findEmail?.token) {
    throw new NotFoundDataError("TOKEN");
  }

  return true;
};
