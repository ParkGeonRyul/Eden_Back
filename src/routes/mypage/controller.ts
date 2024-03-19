import { Request, Response } from "express";
import {
  NotFoundDataError,
  PropertyRequiredError,
  InvalidPropertyError,
} from "../../utils/cunstomError";
import { reportErrorMessage } from "../../utils/errorHandling";
import {
  findUserById,
  updateUserInfo,
  getPaginatedList,
  selectInquiry,
  getLatestInquiry,
} from "./service";

// '마이페이지 - 내 정보' 조회
export const getMypage = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;

    if (!userId) throw new NotFoundDataError("userId_DATA");

    const currentUserInfo = await findUserById(userId);

    res.status(200).json(currentUserInfo);
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

// '마이페이지 - 내 정보' 수정
export const editMypage = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) throw new NotFoundDataError("userId_DATA");

    const { userEmail, phoneNumber, address, birthDate, userImage } = req.body;

    if (!userEmail && !phoneNumber && !address && !birthDate && !userImage)
      throw new PropertyRequiredError("AT_LEAST");

    const updatedUserInfo = await updateUserInfo(
      userEmail,
      phoneNumber,
      address,
      birthDate,
      userImage,
      userId
    );

    console.log("updatedUserInfo =", updatedUserInfo);

    // res.status(200).send();
    res.status(200).json(updatedUserInfo);
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

// '마이페이지 - 내 게시글' 조회
export const getMyInquiry = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) throw new NotFoundDataError("userId_DATA");

    const userEmail = req.session.userEmail as string;
    if (!userId) throw new NotFoundDataError("userEmail_DATA");

    const { inquiryUniqueId } = req.query;

    let selectedMyInquiry;
    if (!inquiryUniqueId) {
      selectedMyInquiry = await getLatestInquiry(userEmail);
    } else {
      selectedMyInquiry = await selectInquiry(inquiryUniqueId as string);
    }

    res.status(200).json(selectedMyInquiry);
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

// '마이페이지 - 내 게시글 목록' 조회
export const getMyInquiriesList = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) throw new NotFoundDataError("userId_DATA");

    const userEmail = req.session.userEmail as string;
    if (!userEmail) throw new NotFoundDataError("userEmail_DATA");

    const pageNumber: number = parseInt(req.query.page as string);
    const limit: number = parseInt(req.query.limit as string);

    if (isNaN(pageNumber) || !Number.isInteger(pageNumber))
      throw new InvalidPropertyError("PAGE_PROPERTY_TYPE");

    if (isNaN(limit) || !Number.isInteger(limit))
      throw new InvalidPropertyError("LIMIT_PROPERTY_TYPE");

    const sortedInquiry = await getPaginatedList(userEmail, pageNumber, limit);

    res.status(200).json(sortedInquiry);
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};
