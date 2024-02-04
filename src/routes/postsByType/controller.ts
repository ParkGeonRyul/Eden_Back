import { Request, Response } from "express";
import { PropertyRequiredError } from "../../utils/cunstomError";
import { reportErrorMessage } from "../../utils/errorHandling";
import { insertPostDB } from "../postsByType/service";

interface PostLoginReqBody {
  content: string;
  uploadFile: [{ fileUrl: string }];
  isSign: boolean;
  language: string;
  category: number;
}

export const insertPost = async (req: Request, res: Response) => {
  try {
    const {
      content,
      uploadFile,
      isSign,
      language,
      category,
    }: PostLoginReqBody = req.body;

    if (!content || !isSign || !language || !category) {
      const missingField = !content
        ? "content"
        : !isSign
        ? "isSign"
        : !language
        ? "language"
        : "category";
      throw new PropertyRequiredError(`${missingField}`);
    }

    await insertPostDB(content, uploadFile, isSign, language, category);

    return res.status(200).json({ message: "SUCCESS CREATED DATA" });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};
