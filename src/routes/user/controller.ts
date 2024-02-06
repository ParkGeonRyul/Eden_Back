import { Request, Response } from "express";
import * as userService from "../user/service";
import { reportErrorMessage } from "../../utils/errorHandling";
import { ValidationError } from "../../utils/cunstomError";

export const signUp = async (req: Request, res: Response) => {
  try {
    //auths.userData.userId, auths.userData.userEmail,auths.secret.bcrypt,
    // avatar.firstName, avatar.surName, phoneNumber
    const { id, email, password, firstName, surName, phoneNumber } = req.body;
    if (await userService.getUserById(id)) {
      throw new ValidationError("이미 가입된 아이디입니다.", 400);
    }

    if (await userService.getUserByEmail(email)) {
      throw new ValidationError("이미 가입된 이메일입니다.", 400);
    }
    await userService.signUp(
      id,
      email,
      password,
      firstName,
      surName,
      phoneNumber
    );

    res.status(201).json({ message: "user is create!" });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};
