import mongoose, { Schema } from "mongoose";
import ICartItem from "../interfaces/cartItem.interface";

export const CartItemSchema = new Schema<ICartItem>({
  amount: { type: Number, default: 1 },
  productRef: { type: Schema.Types.ObjectId, ref: "Product" },
});

export default mongoose.model<ICartItem>("CartItem", CartItemSchema);
