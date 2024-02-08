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
      secret: process.env.SESSION_SECRET as string, // 세션을 암호화
      resave: false, // 세션을 항상 저장할지 결정 (false를 권장)
      saveUninitialized: true, // 초기화 되지 않은채로 스토어에 저장할지를 결정
      cookie: { secure: false, maxAge: 60 * 60 }, //시간 추가(1시간)
      store: MongoStore.create({
        // 데이터를 저장하는 형식
        mongoUrl: process.env.DB_URI,
        collectionName: "sessions",
        ttl: parseInt(process.env.SESSION_TTL as string),
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
