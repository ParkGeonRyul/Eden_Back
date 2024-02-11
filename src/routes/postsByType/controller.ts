import { Request, Response } from "express";
import {
  NotFoundDataError,
  PropertyRequiredError,
} from "../../utils/cunstomError";
import { reportErrorMessage } from "../../utils/errorHandling";
import * as postsByTypeDB from "../postsByType/service";

/// type

interface PostLoginReqBody {
  title: string;
  content: string;
  uploadFile: [{ fileUrl: string }];
  isSign: boolean;
  language: number;
  category: number;
}

// 1. Insert POst API

export const insertPost = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      uploadFile,
      isSign,
      language,
      category,
    }: PostLoginReqBody = req.body;

    if (!title || !content || isSign === undefined || !language || !category) {
      const missingField = !title
        ? "title"
        : !content
        ? "content"
        : !isSign
        ? "isSign"
        : !language
        ? "language"
        : "category";
      throw new PropertyRequiredError(`${missingField}`);
    }

    const postId = await postsByTypeDB.insertPostDB(
      title,
      content,
      uploadFile,
      isSign,
      language,
      category
    );

    return res
      .status(200)
      .json({ message: "SUCCESS CREATED DATA", postId: postId });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

// 2. GET Post Details API

export const getPostDetails = async (req: Request, res: Response) => {
  try {
    const postId: string = req.params.postId;
    const userIsSign = req.session.isSignedIn || false;

    if (!postId) {
      throw new PropertyRequiredError(postId);
    }

    const postDetails = await postsByTypeDB.getPostDetailsDB(
      postId,
      userIsSign
    );
    if (!postDetails) throw new NotFoundDataError("POST");
    return res.status(200).json({ data: postDetails });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

// 3. Modify Post API

export const modifyPost = async (req: Request, res: Response) => {
  try {
    const postId: string = req.params.postId;
    const {
      title,
      content,
      uploadFile,
      isSign,
      language,
      category,
    }: PostLoginReqBody = req.body;

    if (!postId) {
      throw new PropertyRequiredError(postId);
    }

    if (!title || !content || !isSign || !language || !category) {
      const missingField = !title
        ? "title"
        : !content
        ? "content"
        : !isSign
        ? "isSign"
        : !language
        ? "language"
        : "category";
      throw new PropertyRequiredError(`${missingField}`);
    }

    const modifiedPost = await postsByTypeDB.modifyPostDB(
      postId,
      title,
      content,
      uploadFile,
      isSign,
      language,
      category
    );
    if (!modifiedPost) throw new NotFoundDataError("POST");

    return res
      .status(200)
      .json({ message: "SUCCESS UPDATE POST", postId: modifiedPost });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

// 4. Delete Post API

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId: string = req.params.postId;

    if (!postId) {
      throw new PropertyRequiredError(postId);
    }

    await postsByTypeDB.deletePostDB(postId);
    return res.status(200).json({ message: "SUCCESS DELETE POST" });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};

// 5. GET Post List API

export const getPostList = async (req: Request, res: Response) => {
  try {
    const pageNumber: string = req.query.page?.toString() || "1";
    const limit: string = req.query.limit?.toString() || "5";
    const category: string = req.query.category?.toString() || "1";
    const word: string = req.query.search?.toString() || "";
    const language: string = req.query.language?.toString() || "";
    const isSign = req.session.isSignedIn || false;

    if (!pageNumber || !limit || !category) {
      const missingField = !pageNumber
        ? "pageNumber"
        : !limit
        ? "limit"
        : "category";
      throw new PropertyRequiredError(`${missingField}`);
    }

    const postList = await postsByTypeDB.postListDB(
      Number(pageNumber),
      Number(limit),
      Number(category),
      word,
      Number(language),
      isSign
    );

    if (!postList) throw new NotFoundDataError("POSTLIST");

    return res.status(200).json({ data: postList });
  } catch (err: unknown) {
    return reportErrorMessage(err, res);
  }
};
