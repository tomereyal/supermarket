import { ObjectId, Types } from "mongoose";

export default interface ICartItem extends Types.Subdocument {
  _id: ObjectId;
  amount: number;
  productRef: ObjectId;
}
