import { Request, Response } from "express";
import * as userService from "../user/service";
import { reportErrorMessage } from "../../utils/errorHandling";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { id, email, password, firstName, surName, phoneNumber } = req.body;
    await userService.signUp(
      id,
      email,
      password,
      firstName,
      surName,
      phoneNumber
    );

    res.status(201).json({ message: "User is create" });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userService.signIn(email, password);

    if (user) {
      (req.session.isSignedIn = true),
        (req.session.userId = user.auths?.userData?.userId!.toString());
    }

    console.log(req.session);
    res.status(200).json({ message: "Login Success" });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

export const emailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    await userService.emailAuthService(email);

    res.status(200).json({message : "Email sent complete"});
  } catch (err: unknown) {
    reportErrorMessage(err, res);
  }
};

export const emailConfirm = async (req: Request, res: Response) => {
  try{
    const { email, token } = req.body;

    await userService.emailConfirm(email, token);

    res.status(200).json({message : "Token has confirm"})
  }
  catch(err: unknown) {
    reportErrorMessage(err, res);    
  }
}
