import TechStack from "../models/techStackModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundErr, UnauthorizedErr } from "../errors/customErors.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multer.js";



// Create API's
export const createTechStack = async (req, res) => {
    if (req.user.role !== "admin") {
      throw new UnauthorizedErr("You are not authorized to access this route");
    }
    console.log(`req files .file`,req.file)
    const newTechStack = { ...req.body };
    // Handle main image upload
    if (req.file) {
      const imageUrl = formatImage(req.file);
      const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
      newTechStack.imageUrl = imageResponse.secure_url;
      newTechStack.imagePublicId = imageResponse.public_id;
    }
  
    const techStack = await TechStack.create(newTechStack);
    res.status(StatusCodes.CREATED).json({ techStack });
  };


// Read API's
export const getAllTechStacks = async (req, res) => {
  const { search } = req.query;

  const queryObject = {};

  if (search) {
    // Search across relevant fields
    queryObject.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { skillsRelated: { $regex: search, $options: "i" } },
      { techStack: { $regex: search, $options: "i" } },
    ];
  }

  // Setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const techStacks = await TechStack.find(queryObject).limit(limit).skip(skip);
  const totalTechStacks = await TechStack.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalTechStacks / limit);

  res.status(StatusCodes.OK).json({
    totalTechStacks,
    numOfPages,
    currentPage: page,
    techStacks,
  });
};

export const getSingleTechStack = async (req, res) => {
  const { id } = req.params;
  const techStack = await TechStack.findOne({ _id: id });

  if (!techStack) {
    throw new NotFoundErr(`No techStack with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ techStack });
};


// Update API's
export const updateTechStack = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const { id } = req.params;
  const updatedTechStack = { ...req.body };
  console.log(`req files .file`,req.file)
  console.log(`req body`,req.body)


  // Find the existing project
  const existingTechStack = await TechStack.findById(id);
  if (!existingTechStack) {
    throw new NotFoundErr(`No techStack with id ${id}`);
  }

  // Handle main image upload
  if (req.file) {
    console.log(`req files .file`,req.file)
    const imageUrl = formatImage(req.file);
    const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
    updatedTechStack.imageUrl = imageResponse.secure_url;
    updatedTechStack.imagePublicId = imageResponse.public_id;

    // Delete old image if exists
    if (existingTechStack.imagePublicId) {
      await cloudinary.v2.uploader.destroy(existingTechStack.imagePublicId);
    }
  }

  const result = await TechStack.findByIdAndUpdate(id, updatedTechStack, {
    new: true,
    runValidators: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "TechStack updated", techStack: result });
};

// Delete API's
export const deleteTechStack = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const { id } = req.params;
  const techStack = await TechStack.findById(id);

  if (!techStack) {
    throw new NotFoundErr(`No techStack with id ${id}`);
  }

  // Delete associated images from Cloudinary
  if (techStack.imagePublicId) {
    await cloudinary.v2.uploader.destroy(techStack.imagePublicId);
  }
  await TechStack.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ msg: "TechStack deleted" });
};