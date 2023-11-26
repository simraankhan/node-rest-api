import { NextFunction, Request, Response } from "express";
import { IProductResponse } from "../routes/product/interface";
import { Product } from "../models/product";

export const getAllProducts = async (
  req: Request<{}, IProductResponse>,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      message: "OK",
      data: products,
    });
  } catch (error) {
    console.error(error);
    // @ts-ignore
    res.status(error?.status || 400).json(error);
  }
};
