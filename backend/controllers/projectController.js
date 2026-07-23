import Project from "../models/projectModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundErr, UnauthorizedErr } from "../errors/customErors.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multer.js";

export const getAllProjects = async (req, res) => {
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

  const projects = await Project.find(queryObject).limit(limit).skip(skip);
  const totalProjects = await Project.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalProjects / limit);

  res.status(StatusCodes.OK).json({
    totalProjects,
    numOfPages,
    currentPage: page,
    projects,
  });
};

export const createProject = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const newProject = { ...req.body };

  // Convert date strings to Date objects
  if (newProject.startDate) {
    newProject.startDate = new Date(newProject.startDate);
  }
  if (newProject.endDate) {
    newProject.endDate = new Date(newProject.endDate);
  }

  // Convert string arrays to actual arrays if they're not already
  if (newProject.skillsRelated && typeof newProject.skillsRelated === 'string') {
    newProject.skillsRelated = newProject.skillsRelated.split(',').map(skill => skill.trim());
  }
  
  if (newProject.techStack && typeof newProject.techStack === 'string') {
    newProject.techStack = newProject.techStack.split(',').map(tech => tech.trim());
  }

  // Handle main image upload
  if (req.files && req.files.imageUrl && req.files.imageUrl[0]) {
    const imageUrl = formatImage(req.files.imageUrl[0]);
    const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
    newProject.imageUrl = imageResponse.secure_url;
    newProject.imagePublicId = imageResponse.public_id;
  }

  // Handle background image upload
  if (req.files && req.files.backgroundImage && req.files.backgroundImage[0]) {
    const bgImageUrl = formatImage(req.files.backgroundImage[0]);
    const bgImageResponse = await cloudinary.v2.uploader.upload(bgImageUrl);
    newProject.backgroundImage = bgImageResponse.secure_url;
    newProject.backgroundPublicId = bgImageResponse.public_id;
  }

  const project = await Project.create(newProject);
  res.status(StatusCodes.CREATED).json({ project });
};

export const getSingleProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findOne({ _id: id });

  if (!project) {
    throw new NotFoundErr(`No project with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ project });
};

export const updateProject = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const { id } = req.params;
  const updatedProject = { ...req.body };

  // Convert date strings to Date objects
  if (updatedProject.startDate) {
    updatedProject.startDate = new Date(updatedProject.startDate);
  }
  if (updatedProject.endDate) {
    updatedProject.endDate = new Date(updatedProject.endDate);
  }

  // Convert string arrays to actual arrays if they're not already
  if (updatedProject.skillsRelated && typeof updatedProject.skillsRelated === 'string') {
    updatedProject.skillsRelated = updatedProject.skillsRelated.split(',').map(skill => skill.trim());
  }
  
  if (updatedProject.techStack && typeof updatedProject.techStack === 'string') {
    updatedProject.techStack = updatedProject.techStack.split(',').map(tech => tech.trim());
  }

  // Find the existing project
  const existingProject = await Project.findById(id);
  if (!existingProject) {
    throw new NotFoundErr(`No project with id ${id}`);
  }

  // Handle main image upload
  if (req.files && req.files.imageUrl && req.files.imageUrl[0]) {
    const imageUrl = formatImage(req.files.imageUrl[0]);
    const imageResponse = await cloudinary.v2.uploader.upload(imageUrl);
    updatedProject.imageUrl = imageResponse.secure_url;
    updatedProject.imagePublicId = imageResponse.public_id;

    // Delete old image if exists
    if (existingProject.imagePublicId) {
      await cloudinary.v2.uploader.destroy(existingProject.imagePublicId);
    }
  }

  // Handle background image upload
  if (req.files && req.files.backgroundImage && req.files.backgroundImage[0]) {
    const bgImageUrl = formatImage(req.files.backgroundImage[0]);
    const bgImageResponse = await cloudinary.v2.uploader.upload(bgImageUrl);
    updatedProject.backgroundImage = bgImageResponse.secure_url;
    updatedProject.backgroundPublicId = bgImageResponse.public_id;

    // Delete old background image if exists
    if (existingProject.backgroundPublicId) {
      await cloudinary.v2.uploader.destroy(existingProject.backgroundPublicId);
    }
  }

  const result = await Project.findByIdAndUpdate(id, updatedProject, {
    new: true,
    runValidators: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Project updated", project: result });
};

export const deleteProject = async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new UnauthorizedErr("You are not authorized to access this route");
  }

  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    throw new NotFoundErr(`No project with id ${id}`);
  }

  // Delete associated images from Cloudinary
  if (project.imagePublicId) {
    await cloudinary.v2.uploader.destroy(project.imagePublicId);
  }
  
  if (project.backgroundPublicId) {
    await cloudinary.v2.uploader.destroy(project.backgroundPublicId);
  }

  await Project.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ msg: "Project deleted" });
};