import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import favicon from "serve-favicon";
import path from "path";
import { routes } from "./src/routes";
import session from "express-session";
import MongoStore from "connect-mongo";

import "./types/express-extensions";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(morgan("combined"));
  app.use(express.json());
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string, // 세션 암호화
      resave: false, // 세션을 항상 저장할지 결정 (false 권장)
      saveUninitialized: true, // 초기화 되지 않은채로 스토어에 저장할지 결정
      cookie: {
        secure: false,
        maxAge: parseInt(process.env.SESSION_MAXAGE as string), // 세션 쿠키 만료 시간 (밀리초 단위)
      },
      store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        collectionName: "sessions",
        ttl: parseInt(process.env.SESSION_TTL as string), // 세션 DB 저장 기간 (초 단위)
      }),
    })
  ); // 라우터보다 먼저 선언
  app.use(routes);

  app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "pong" });
  });

  app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Can't fine ${req.originalUrl} on this server!`);

    next(err);
  });

  return app;
};
