import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import { routes } from './src/routes'
// import { globalErrorHandler } from './src/utils/error'

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(morgan("combined"));
  app.use(express.json());
  // app.use(routes);

  app.get("/ping", (req, res, next) => {
    res.status(200).json({ message: "pong" });
  });

  app.all("*", (req, res, next) => {
    const err = new Error(`Can't fine ${req.originalUrl} on this server!`);

    next(err);
  });

  // app.use(globalErrorHandler);

  return app;
};