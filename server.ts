import "dotenv/config";
import { createApp } from "./app";
import mongoose from "mongoose";
import { reconnectServer } from "./src/utils/reconnect";

const startServer = async () => {
  const app = createApp();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, async () => {
    await mongoose
      .connect(`${process.env.DB_URI}`)
      .then(() => {
        console.log("Data Source has been initialized!");
        console.log(`Listening to request on 127.0.0.1:${PORT}`);
      })
      .catch(() => {
        reconnectServer();
      });
  });
};

startServer();
