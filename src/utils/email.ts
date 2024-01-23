import "dotenv/config";
import * as nodemailer from "nodemailer";

export const generateRandom = function (min: number, max: number): number {
  const randomNumber: number = Math.floor(
    Math.random() * (max - min + 1) + min
  );
  return randomNumber;
};

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
