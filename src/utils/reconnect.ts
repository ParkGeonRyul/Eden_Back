import 'dotenv/config'
import mongoose from "mongoose";

export const reconnectServer = async() => {
  try {
    console.log("Reconnecting Database Server...");
    await mongoose.connect(`${process.env.DB_URI}`);
    const status = await connectStatus();

    if (status !== 1) {
      const err = new Error("test");
      throw err;
    }
    console.log("Database has been reconnected")
  } catch (err: unknown) {
    // if (err instanceof CustomError_Class){
      
    // }
  }};

export const connectStatus = async() => {
  return mongoose.connection.readyState;
};