import { Date } from "mongoose";

export default interface IOrder {
  customer: {
    firstName: string;
    lastName: string;
    address: { city: string; street: string };
    email: string;
    _id: string;
  };
  cart: {
    _id: string;
    createdAt: string;
    customerRef: string;
    cartItems: {
      _id: string;
      amount: number;
      product: {
        _id: string;
        name: string;
        price: number;
        url: string;
        category: string;
      };
    }[];
  };
  totalPrice: number;
  destination: { city: string; street: string };
  timeOfArrival: Date;
  paymentDigits: number;
}
