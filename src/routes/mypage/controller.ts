import { Request, Response } from "express";
import { getUserById } from "./service";

export const getMypage = async (req: Request, res: Response) => {
  try {
    console.log(
      "----------------------- mypage controller start -----------------------"
    );
    console.log("req.session.id =", req.session.id);

    const userId = req.session.userId;
    if (userId) {
      const currentUserInformation = await getUserById(userId);
      console.log("userInformation =", currentUserInformation);
      res.status(200).json({ currentUserInformation });
    } else {
      res.status(400).json({ error: "User ID is undefined" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
