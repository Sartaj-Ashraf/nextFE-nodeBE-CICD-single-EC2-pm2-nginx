import { Router } from "express";
const router = Router();

import {
  getAllProjects,
  getSingleProject,
  updateProject,
  createProject,
  deleteProject,
} from "../controllers/projectController.js";

import {
  validateIdParam,
  // validateProjectInput,
} from "../middleware/validationMiddleware.js";

import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

// Routes
router
  .route("/")
  .get(getAllProjects)
  .post(
    authenticateUser,
    upload.fields([
      { name: 'imageUrl', maxCount: 1 },
      { name: 'backgroundImage', maxCount: 1 }
    ]),
    // validateProjectInput,
    createProject
  );

router
  .route("/:id")
  .get(validateIdParam, getSingleProject)
  .patch(
    authenticateUser,
    upload.fields([
      { name: 'imageUrl', maxCount: 1 },
      { name: 'backgroundImage', maxCount: 1 }
    ]),
    // validateProjectInput,
    validateIdParam,
    updateProject
  )
  .delete(authenticateUser, validateIdParam, deleteProject);

export default router;