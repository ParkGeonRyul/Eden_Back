import { Request, Response, NextFunction } from "express";
import { users } from "../models/usersServer";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req.session =", req.session);
    if (req.session && req.session.isSignedIn) {
      req.user = req.session;

      next();
    } else {
      return res.json({ isAuth: false, authSuccess: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
