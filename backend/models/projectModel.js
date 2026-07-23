import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String,required:true },
    description: { type: String,required:true },
    projectUrl: { type: String},
    skillsRelated:{type:[String]},
    techStack:{type:[String]},
    startDate: { type: Date },
    endDate: { type: Date },
    imageUrl: { type: String},
    imagePublicId: { type: String },
    backgroundImage:{type:String},
    backgroundPublicId:{type:String},
    isFeatured:{type:Boolean,default:false}

  },
  { timestamps: true }
);

export default mongoose.model("PortfolioProject", projectSchema);
