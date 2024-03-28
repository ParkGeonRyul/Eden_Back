import { Request, Response } from "express";
import { createInquiry, updateInquiry } from "./service";

// createdAt, updatedAt rename test
export const inputInquiry = async (req: Request, res: Response) => {
  try {
    const { userName, userEmail, category, title, content, answer } = req.body;

    const userInformation = await createInquiry(
      userName,
      userEmail,
      category,
      title,
      content,
      answer
    );
    if (!userInformation)
      return res.status(400).json({
        message: "create inquiry failed",
      });
    res.status(200).json({ userInformation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const modifyInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { inquiryTitle, inquiryAnswer } = req.body;
    const correctionResult = await updateInquiry(
      id,
      inquiryTitle,
      inquiryAnswer
    );

    console.log(correctionResult);
    res.status(200).json({ correctionResult });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
