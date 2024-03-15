import "dotenv/config";
import * as nodemailer from "nodemailer";

interface MailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  text: string;
};

export const generateRandom = function (min: number, max: number): number {
  const randomNumber: number = Math.floor(
    Math.random() * (max - min + 1) + min
  );
  return randomNumber;
};

export const transporter = nodemailer.createTransport({
    service: process.env.SERVICECODE,
    port: 587,
    secure: false,
    host: process.env.HOST,
    auth: {
      user: process.env.USERCODE,
      pass: process.env.SECRET,
    }
  });