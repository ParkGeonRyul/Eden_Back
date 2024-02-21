import { Request, Response } from "express";
import * as userService from "../user/service";
import { generateRandom, transporter } from "../../utils/email";
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

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userService.signIn(email, password);

    if (user) {
      (req.session.isSignedIn = true),
        (req.session.userId = user.auths?.userData?.userId!);
    }

    console.log(req.session);
    res.status(200).json({ message: "로그인 성공" });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

interface MailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  text: string;
}

export const emailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const randomNumber = String(generateRandom(111111, 999999));

    const mailOptions: MailOptions = {
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "테스트",
      text: randomNumber,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ message: "email 전송 중 에러가 발생했습니다." });
      } else {
        console.log(info);
        res.status(200).json({ message: "인증번호 발급완료" });
      }
    });
  } catch (err: any) {
    res.status(500).json({ err: "Internal Server Error!" });
  }
};
