import { Request, Router } from "express";
import { IOrder, IOrderResponse } from "./interface";
import { Order } from "../../models/order";
import { Product } from "../../models/product";

const router = Router();

router.get("/", async (req: Request<{}, IOrderResponse>, res, next) => {
  try {
    const orders = await Order.find({}).populate("product");
    res.status(200).json({
      message: "OK",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    // @ts-ignore
    res.status(error?.status || 400).json(error);
  }
});

router.post(
  "/",
  async (req: Request<{}, IOrderResponse, IOrder>, res, next) => {
    try {
      const product = await Product.findById(req.body.productId);
      if (!product) {
        res.status(404).json({
          message: "Product not found",
        });
        return;
      }
      const newOrder = await Order.create({
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      res.status(201).json({
        message: "Created",
        data: newOrder,
      });
    } catch (error) {
      console.error(error);
      // @ts-ignore
      res.status(error?.status || 400).json(error);
    }
  }
);

router.get(
  "/:orderId",
  async (
    req: Request<{ orderId: { orderId: string } }, IOrderResponse>,
    res,
    next
  ) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        res.status(404).json({
          message: "Record not found",
        });
        return;
      }
      res.status(200).json({
        message: "OK",
        data: order,
      });
    } catch (error) {
      console.error(error);
      // @ts-ignore
      res.status(error?.status || 400).json(error);
    }
  }
);

router.delete(
  "/:orderId",
  async (
    req: Request<{ orderId: { orderId: string } }, IOrderResponse>,
    res,
    next
  ) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        res.status(404).json({
          message: "Record not found",
        });
        return;
      }
      const data = await Order.findByIdAndDelete(req.params.orderId);
      res.status(200).json({
        message: "Record deleted",
        data,
      });
    } catch (error) {
      console.error(error);
      // @ts-ignore
      res.status(error?.status || 400).json(error);
    }
  }
);

export default router;
