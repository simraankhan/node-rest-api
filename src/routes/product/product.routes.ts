import { NextFunction, Request, Response, Router } from "express";
import { IProduct, IProductResponse } from "./interface";
import { Product } from "../../models/product";
import multer from "multer";
import { checkAuth } from "../../middleware/check-auth";
import { getAllProducts } from "../../controller/product.controller";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(`File type - ${file.mimetype} cannot be accept`) as any,
        false
      );
    }
  },
});

const router = Router();

router.get("/", getAllProducts);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  async (
    req: Request<{}, IProductResponse, IProduct>,
    res: Response,
    next: NextFunction
  ) => {
    const file = req.file;
    try {
      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        image: `uploads/${file?.filename}`,
      });
      res.status(201).json({
        message: "Created",
        data: product,
      });
    } catch (error) {
      console.error(error);
      // @ts-ignore
      res.status(error?.status || 400).json(error);
    }
  }
);

router.get(
  "/:productId",
  async (
    req: Request<{ productId: { productId: string } }, IProductResponse>,
    res,
    next
  ) => {
    try {
      const id = req.params.productId;
      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({
          message: "No record found",
        });
        return;
      }
      res.status(200).json({
        message: "OK",
        data: product,
      });
    } catch (error) {
      console.error(error);
      // @ts-ignore
      res.status(error?.status || 400).json(error);
    }
  }
);

router.patch(
  "/:productId",
  async (
    req: Request<
      { productId: { productId: string } },
      IProductResponse,
      IProduct
    >,
    res,
    next
  ) => {
    try {
      const id = req.params.productId;
      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({
          message: "No record found",
        });
        return;
      }
      product.name = req.body.name;
      product.price = req.body.price;
      await product.save();
      res.status(200).json({
        message: "OK",
        data: product,
      });
    } catch (error) {
      console.error(error);
      // @ts-ignore
      res.status(error?.status || 400).json(error);
    }
  }
);

router.delete(
  "/:productId",
  async (
    req: Request<{ productId: { productId: string } }, IProductResponse>,
    res,
    next
  ) => {
    try {
      const id = req.params.productId;
      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({
          message: "No record found",
        });
        return;
      }
      await Product.findByIdAndDelete(id);
      res.status(200).json({
        message: "OK",
      });
    } catch (error) {
      console.error(error);
      // @ts-ignore
      res.status(error?.status || 400).json(error);
    }
  }
);

export default router;
