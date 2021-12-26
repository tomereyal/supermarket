import mongoose, { Schema } from "mongoose";
import ITopic from "../interfaces/topic.interface";

const TopicSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    extraInformation: { type: String },
  },
  {
    timestamps: true,
  }
);
TopicSchema.post<ITopic>("save", function () {
  this.extraInformation =
    "This is a template usage of post schema method functions";
});

export default mongoose.model<ITopic>("Topic", TopicSchema);
