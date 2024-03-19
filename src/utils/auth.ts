import { UnauthorizedAccessError } from "../utils/cunstomError";
import { Request, Response, NextFunction } from "express";
import { reportErrorMessage } from "../utils/errorHandling";

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
      throw new UnauthorizedAccessError(); // isAuth: false, authSuccess: false
    }
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};
