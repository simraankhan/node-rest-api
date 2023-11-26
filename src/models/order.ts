import { Schema, model, models } from "mongoose";

const orderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    require: [true, "Product is required"],
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

export const Order = models.Order || model("Order", orderSchema);
