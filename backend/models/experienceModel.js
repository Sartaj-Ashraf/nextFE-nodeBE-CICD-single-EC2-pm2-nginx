import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    position: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String },
    isFeatured: { type: Boolean, default: false },
    isCurrentlyWorking: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
