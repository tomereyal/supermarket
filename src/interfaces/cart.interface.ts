import { ObjectId, Types } from "mongoose";
import ICartItem from "./cartItem.interface";

export default interface ICart {
  customerRef: ObjectId;
  cartItems: Types.DocumentArray<ICartItem> | [];
}

//FOR DEALING WITH TYPESCRIPT AND MONGOOSE SUBDOCUMENTS:
//https://stackoverflow.com/questions/57698371/missing-subdocument-methods-in-mongoose-with-typescript
