import mongoose, { Schema } from "mongoose";

const policyCategorySchema = new Schema({
  category_name: { type: String, required: true },
});
export const policyCategoryModel = mongoose.model("PolicyCategory", policyCategorySchema);
