import { Request, Response } from "express";
import { createUser, checkExistingUser, getUser } from "./service";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { userId, userEmail, password, firstName, surName, phoneNumber } =
      req.body;

    const existingUser = await checkExistingUser(userId, userEmail);
    if (existingUser)
      return res.status(400).json({
        message: "User with the same userId and userEmail already exists",
      });

    const userInformation = await createUser(
      userId,
      userEmail,
      password,
      firstName,
      surName,
      phoneNumber
    );
    if (!userInformation)
      return res.status(400).json({
        message: "Sign-up failed",
      });
    res.status(200).json({ userInformation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;

    const user = await getUser(userId, password);

    if (user) {
      req.session.isSignedIn = true;
      req.session.userId = userId;
      req.session.userEmail = user.auths.userData.userEmail as string;

      console.log("sessionId =", req.session.id);

      res.status(200).json({ isAuth: true, authSuccess: true });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
