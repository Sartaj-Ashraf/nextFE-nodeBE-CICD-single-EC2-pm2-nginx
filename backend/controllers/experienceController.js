import Experience from "../models/experienceModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundErr, UnauthorizedErr } from "../errors/customErors.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multer.js";

export const getAllExperience = async (req, res) => {
  const { search } = req.query;

  const queryObject = {};

  if (search) {
    // Search across relevant fields
    queryObject.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { position: { $regex: search, $options: "i" } },
    ];
  }

  // Setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const experiences = await Experience.find(queryObject).limit(limit).skip(skip);
  const totalExperiences = await Experience.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalExperiences / limit);

  res.status(StatusCodes.OK).json({
    totalExperiences,
    numOfPages,
    currentPage: page,
    experiences,
  });
};

export const createExperience = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const newExperience = { ...req.body };

  // Convert date strings to Date objects
  if (newExperience.startDate) {
    newExperience.startDate = new Date(newExperience.startDate);
  }
  if (newExperience.endDate) {
    newExperience.endDate = new Date(newExperience.endDate);
  }

  if (req.file) {
    const imageUrl = formatImage(req.file);
    const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
    newExperience.imageUrl = imageResponse.secure_url;
    newExperience.imagePublicId = imageResponse.public_id;
  }

  const experience = await Experience.create(newExperience);
  res.status(StatusCodes.CREATED).json({ experience });
};

export const getSingleExperience = async (req, res) => {
  const { id } = req.params;
  const experience = await Experience.findOne({ _id: id });

  if (!experience) {
    throw new NotFoundErr(`No experience with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ experience });
};

export const updateExperience = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const { id } = req.params;
  const updatedExperience = { ...req.body };

  // Convert date strings to Date objects
  if (updatedExperience.startDate) {
    updatedExperience.startDate = new Date(updatedExperience.startDate);
  }
  if (updatedExperience.endDate) {
    updatedExperience.endDate = new Date(updatedExperience.endDate);
  }

  // Find the existing experience
  const existingExperience = await Experience.findById(id);
  if (!existingExperience) {
    throw new NotFoundErr(`No experience with id ${id}`);
  }

  // Handle image upload
  if (req.file) {
    const imageUrl = formatImage(req.file);
    const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
    updatedExperience.imageUrl = imageResponse.secure_url;
    updatedExperience.imagePublicId = imageResponse.public_id;

    // Delete old image if exists
    if (existingExperience.imagePublicId) {
      await cloudinary.v2.uploader.destroy(existingExperience.imagePublicId);
    }
  }

  const result = await Experience.findByIdAndUpdate(id, updatedExperience, {
    new: true,
    runValidators: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Experience updated", experience: result });
};

export const deleteExperience = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const { id } = req.params;
  const experience = await Experience.findById(id);

  if (!experience) {
    throw new NotFoundErr(`No experience with id ${id}`);
  }

  // Delete associated image from Cloudinary
  if (experience.imagePublicId) {
    await cloudinary.v2.uploader.destroy(experience.imagePublicId);
  }

  await Experience.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ msg: "Experience deleted" });
};