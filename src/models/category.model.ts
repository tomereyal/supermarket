import mongoose, { Schema } from "mongoose";
import ICategory from "../interfaces/category.interface";
const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
});

//
//error i had received was from mongoose: cannot override model User..
//because I accidently wrote User instead of Catergory below..
//https://coderedirect.com/questions/342054/how-to-get-rid-of-error-overwritemodelerror-cannot-overwrite-undefined-mode

export default mongoose.model<ICategory>("Category", CategorySchema);
