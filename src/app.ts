import express, { NextFunction, Request, Response } from "express";
import ProductRoutes from "./routes/product/product.routes";
import OrderRoutes from "./routes/order/order.routes";
import UserRoutes from "./routes/user/user.routes";
import morgan from "morgan";
import dotEnv from "dotenv";
import { conntectToDB } from "./utils/database";

dotEnv.config();

const app = express();

conntectToDB();

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, GET, DELETE");
  }
  next();
});

// routes
app.use("/uploads", express.static("uploads"));
app.use("/product", ProductRoutes);
app.use("/order", OrderRoutes);
app.use("/auth", UserRoutes);

// error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  // @ts-ignore
  error.status = 404;
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
