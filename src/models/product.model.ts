import mongoose, { Schema } from "mongoose";
import IProduct from "../interfaces/product.interface";
const ProductSchema= new Schema<IProduct>(
  {
    name:{type:String, required:true,unique:true },
    price:{type:Number, required:true},
    url:String,
    categoryRef:{type:mongoose.Schema.Types.ObjectId,ref:"Category"}
  }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
