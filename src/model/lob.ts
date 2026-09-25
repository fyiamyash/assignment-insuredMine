import mongoose, { Schema } from "mongoose";

const policyCategorySchema = new Schema({
  category_name: { type: String },
});
export const policyCategoryModel = mongoose.model("PolicyCarrier", policyCategorySchema);
