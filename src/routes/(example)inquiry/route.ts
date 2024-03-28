import express from "express";
import { inputInquiry, modifyInquiry } from "./controller";

export const inquiryRouter = express.Router();

// createdAt, updatedAt rename test
inquiryRouter.post("/insert", inputInquiry);
inquiryRouter.patch("/update/:id", modifyInquiry);
