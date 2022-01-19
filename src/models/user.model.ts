import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/user.interface";

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { street: String, city: String },
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model<IUser>("User", UserSchema);
