import express from "express";
import { signUp } from "./controller";
import { signIn } from "./controller";

export const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.post("/sign-in", signIn);
