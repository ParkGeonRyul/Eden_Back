import bcrypt from "bcrypt";
import { users } from "../../models/usersServer";

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;

  return await bcrypt.hash(password, saltRounds);
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
    const error: any = new Error("Invalid_EMAIL");
    error.statusCode = 400;

    throw error;
  }

  if (!passwordRegex.test(password)) {
    const error: any = new Error("Invalid_PASSWORD");
    error.statusCode = 400;

    throw error;
  }

  const hashedPassword: string = await hashPassword(password);

  // users 데이터 넣기
  //auths.userData.userId, auths.userData.userEmail,auths.secret.bcrypt,
  // avatar.firstName, avatar.surName, phoneNumber
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
      console.error("Error saving user:", error);
      throw error;
    });
};
