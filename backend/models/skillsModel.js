import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Skills", skillsSchema);
