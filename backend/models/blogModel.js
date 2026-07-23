import mongoose from "mongoose";

const blogSchema =new mongoose.Schema(
  {
    // Vehicle details
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    isfeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PortfolioBlog", blogSchema);
