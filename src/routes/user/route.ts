import express from "express";
import * as controller from "../user/controller";

export const userRouter = express.Router();

userRouter.post("/signup", controller.signUp);
userRouter.post("/emailcheck", controller.emailVerification);
userRouter.post("/signin", controller.signIn);
userRouter.get("/emailconfirm", controller.emailConfirm)