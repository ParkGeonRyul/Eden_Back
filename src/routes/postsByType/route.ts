import express from "express";
import { insertPost } from "./controller";

export const postsByTypeRouter = express.Router();

postsByTypeRouter.post("/insertPost", insertPost);
