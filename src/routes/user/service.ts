import bcrypt from "bcrypt";
import { users } from "../../models/usersServer";
import { ValidationError, InternalServerError } from "../../utils/cunstomError";

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
    throw new ValidationError("알맞은 이메일 형식이 아닙니다", 400);
  }

  if (!passwordRegex.test(password)) {
    throw new ValidationError("알맞은 비밀번호 형식이 아닙니다", 400);
  }
  const hashedPassword: string = await hashPassword(password);

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
    throw new ValidationError("가입된 이메일이 없습니다.", 400);
  }

  const result = await bcrypt.compare(
    password.toString(),
    user?.auths?.secret?.bcrypt!.toString()
  );

  if (!result) {
    throw new ValidationError("비밀번호가 다릅니다.", 400);
  }

  return user;
};
