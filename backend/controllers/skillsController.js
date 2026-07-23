import Skills from "../models/skillsModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundErr, UnauthorizedErr } from "../errors/customErors.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multer.js";

export const getAllSkills = async (req, res) => {
  const { search } = req.query;

  const queryObject = {};

  if (search) {
    // Search across all language fields
    queryObject.$or = [
      { "name": { $regex: search, $options: "i" } },
      { "description": { $regex: search, $options: "i" } },
    ];
  }

  // Setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const skills = await Skills.find(queryObject).limit(limit).skip(skip);
  const totalSkills = await Skills.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalSkills / limit);

  res.status(StatusCodes.OK).json({
    totalSkills,
    numOfPages,
    currentPage: page,
    skills,
  });
};
export const createSkill = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const newSkill = { ...req.body };

  if (req.file) {
    const imageUrl = formatImage(req.file);
    const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
    newSkill.imageUrl = imageResponse.secure_url;
    newSkill.imagePublicId = imageResponse.public_id;
  }

  const skill = await Skills.create(newSkill);
  res.status(StatusCodes.CREATED).json({ skill });
};


export const getSingleSkill = async (req, res) => {
  const { id } = req.params;
  console.log({id})
  const skill = await Skills.findOne({ _id:id });

  if (!skill) {
    throw new NotFoundErr(`No skill with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ skill });
};

export const updateSkill = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const { id } = req.params;
  const updatedSkill = { ...req.body };

  // Find the existing skill
  const existingSkill = await Skills.findById(id);
  if (!existingSkill) {
    throw new NotFoundErr(`No skill with id ${id}`);
  }

  // Handle logo upload
  if (req.files && req.files.imageUrl) {
    const imageUrl = formatImage(req.file.imageUrl);
    const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
    updatedSkill.imageUrl = imageResponse.secure_url;
    updatedSkill.imagePublicId = imageResponse.public_id;

    // Delete old logo if exists
    if (existingSkill.imagePublicId) {
      await cloudinary.v2.uploader.destroy(existingSkill.imagePublicId);
    }
  }

  const result = await Skills.findByIdAndUpdate(id, updatedSkill, {
    new: true,
    runValidators: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Skill updated", skill: result });
};

export const deleteSkill = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const { id } = req.params;
  const skill = await Skills.findById(id);

  if (!skill) {
    throw new NotFoundErr(`No skill with id ${id}`);
  }

  // Delete associated images from Cloudinary
  if (skill.imagePublicId) {
    await cloudinary.v2.uploader.destroy(skill.imagePublicId);
  }

  if (skill.backgroundImagePublicId) {
    await cloudinary.v2.uploader.destroy(skill.backgroundImagePublicId);
  }

  await Skills.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ msg: "Skill deleted" });
};
