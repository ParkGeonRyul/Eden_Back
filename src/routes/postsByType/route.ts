import express from "express";
import { getError } from "./controller";

export const postsByTypeRouter = express.Router();

postsByTypeRouter.post("/error", getError);
