import { ObjectId } from "mongoose";

export default interface IProduct {
  name: string;
  price: number;
  url: string;
  categoryRef: ObjectId;
}
