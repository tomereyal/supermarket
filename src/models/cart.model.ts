import mongoose, { Schema } from "mongoose";
import ICart from "../interfaces/cart.interface";
import { CartItemSchema } from "./cartItem.model";

export const CartSchema = new Schema<ICart>(
  {
    customerRef: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    cartItems: {
      type: [CartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", CartSchema);
