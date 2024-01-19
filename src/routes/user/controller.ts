import { Request, Response } from "express";
import * as userService from "../user/service";

export const signUp = async (req: Request, res: Response) => {
  try {
    //auths.userData.userId, auths.userData.userEmail,auths.secret.bcrypt,
    // avatar.firstName, avatar.surName, phoneNumber
    const { id, email, password, firstName, surName, phoneNumber } = req.body;

    await userService.signUp(
      id,
      email,
      password,
      firstName,
      surName,
      phoneNumber
    );

    res.status(201).json({ message: "user is create!" });
  } catch (err: any) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ err: "Internal Server Error!" });
    }
  }
};
