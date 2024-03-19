import express from "express";
import {
  editMypage,
  getMypage,
  getMyInquiry,
  getMyInquiriesList,
} from "./controller";

export const mypageRouter = express.Router();

// 내 정보
mypageRouter.get("/profile", getMypage); // 내 정보 조회
mypageRouter.patch("/profile", editMypage); // 내 정보 수정

// 내 게시글
mypageRouter.get("/inquiry", getMyInquiry); // 내 게시글(문의글) 조회
mypageRouter.get("/inquiry-list", getMyInquiriesList); // 내 게시글(문의글) 리스트 조회
