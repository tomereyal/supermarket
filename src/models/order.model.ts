import mongoose, { Schema } from "mongoose";
import IOrder from "../interfaces/order.interface";

const OrderSchema = new Schema<IOrder>(
  {
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: {
        city: { type: String, required: true },
        street: { type: String, required: true },
      },
      email: { type: String, required: true },
      _id: { type: String, required: true },
    },
    cart: {
      _id: { type: String, required: true },
      createdAt: { type: String, required: true },
      customerRef: { type: String, required: true },
      cartItems: [
        {
          _id: { type: String, required: true },
          amount: { type: Number, required: true },
          product: {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            url: String,
            category: { type: String, required: true },
          },
        },
      ],
    },
    totalPrice: { type: Number, required: true },
    destination: {
      city: { type: String, required: true },
      street: { type: String, required: true },
    },
    timeOfArrival: { type: Date, required: true },
    paymentDigits: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
