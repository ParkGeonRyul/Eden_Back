import express from "express";
import {
  insertPost,
  getPostDetails,
  modifyPost,
  deletePost,
  getPostList,
} from "./controller";
import { authenticateUser } from "../../utils/auth";
export const postsByTypeRouter = express.Router();

postsByTypeRouter.post("/post", authenticateUser, insertPost);
postsByTypeRouter.put("/post/:postId", authenticateUser, modifyPost);
postsByTypeRouter.delete("/post/:postId", authenticateUser, deletePost);
postsByTypeRouter.get("/post-details/:postId", getPostDetails);
postsByTypeRouter.get("/list?", getPostList);
