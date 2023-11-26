import { Schema, model, models } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  image: {
    type: String,
    equired: [true, "Product image is required"],
  },
});

export const Product = models.Product || model("Product", productSchema);
