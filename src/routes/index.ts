import express from "express";
import { authenticateUser } from "../utils/auth";
import { mypageRouter } from "./mypage/route";
import { userRouter } from "./(example)user/route";
import { postsByTypeRouter } from "./postsByType/route";

export const routes = express.Router();
/*첫 번째 엔드포인트
ex) route.use("/sample", sampleRouter)*/
routes.use("/user", userRouter); // example
routes.use("/mypage", authenticateUser, mypageRouter);
routes.use("/postsByType", postsByTypeRouter);
