import express from "express";
import { getMypage } from "./controller";

export const mypageRouter = express.Router();

mypageRouter.get("/profile", getMypage);
