import 'dotenv/config'
import mongoose from "mongoose";

export const reconnectServer = async() => {
  const mongooseStatus = mongoose.connection.readyState;

  if (mongooseStatus !== 1) {
    console.log("Reconnecting Database Server...");
    await mongoose.connect(`${process.env.DB_URI}`);
    const reconnect = mongoose.connection.readyState;
    if (reconnect !== 1) {
      throw new Error(
        "There is a problem with connecting to the server. Please contact server administrator."
      );
    }
    console.log("Database has been reconnected.");
  }
  return true;
};