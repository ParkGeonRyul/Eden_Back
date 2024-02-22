import bcrypt from "bcrypt";
import { emailAuth, users } from "../../models/usersServer";
import {
  ValidationError,
  InternalServerError,
  fetchError,
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
    throw new ValidationError("Invalid Email", 400);
  }

  if (!passwordRegex.test(password)) {
    throw new ValidationError("Invalid Password", 400);
  }
  const hashedPassword: string = await hashPassword(password);

  if (await getUserById(id)) {
    throw new ValidationError("Duplicated ID.", 400); 
  }

  if (await getUserByEmail(email)) {
    throw new ValidationError("Duplicated Email.", 400);
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
    .then((savedUser) => {
      console.log("User saved successfully:", savedUser);
    })
    .catch((error) => {
      console.log(error);
      throw new InternalServerError();
    });
};

export const signIn = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new ValidationError("Wrong ID", 400);
  }

  const result = await bcrypt.compare(
    password.toString(),
    user?.auths?.secret?.bcrypt!.toString()
  );

  if (!result) {
    throw new ValidationError("Wrong Password.", 400);
  }

  return user;
};

export const emailAuthService = async (email: string) => {
  const verifiedEmail = await getUserByEmail(email);
  const findEmailAuth = await emailAuth.findOne({ email: email });

  if (verifiedEmail) {
    throw new ValidationError("Duplicated Email.", 400);
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
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Von Dia - Email Authentication",
    html: `<h1>This code is valid for 10 minutes.<h1><br><h2>${randomNumber}`
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
