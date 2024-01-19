import { Request, Response } from "express";
import {
  ValidationError,
  PropertyRequiredError,
} from "../../utils/cunstomError";
import { reportErrorMessage } from "../../utils/errorHandling";

export const getError = async (req: Request, res: Response) => {
  try {
    const a: string = req.body.a;

    if (!a) {
      throw new PropertyRequiredError("No Property", 401);
    } else if (typeof a !== "string") {
      throw new PropertyRequiredError("No String", 401);
    } else if (a !== "1") {
      throw new ValidationError("Validation Error", 400);
    }
    return res.status(200).json({ message: "a는 1이래!!" });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};
