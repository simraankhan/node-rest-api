import mongoose from "mongoose";

let isConnected = false;

export const conntectToDB = async () => {
  if (isConnected) {
    console.log("MongoDB connected already!");
    return;
  }
  try {
    await mongoose.connect(
      `mongodb+srv://simraankhan358:${process.env.MONGODB_PASSWORD}@cluster0.yhqs5af.mongodb.net/?retryWrites=true&w=majority`,
      {
        dbName: "node-rest-shop-db",
      }
    );
    isConnected = true;
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error(error);
  }
};
