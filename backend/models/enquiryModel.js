import mongoose from "mongoose";

const enquerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
    phone: {
      type: String,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("PortfolioEnquiry", enquerySchema);
