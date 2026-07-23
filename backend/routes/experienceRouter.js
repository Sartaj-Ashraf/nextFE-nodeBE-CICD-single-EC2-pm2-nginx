import { Router } from "express";
const router = Router();

import {
  getAllExperience,
  getSingleExperience,
  updateExperience,
  createExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

import {
  validateIdParam,
  validateExperienceInput,
} from "../middleware/validationMiddleware.js";

import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

// Routes
router
  .route("/")
  .get(getAllExperience)
  .post(
    authenticateUser,
    upload.single("imageUrl"),
    validateExperienceInput,
    createExperience
  );

router
  .route("/:id")
  .get(validateIdParam, getSingleExperience)
  .patch(
    authenticateUser,
    upload.single("imageUrl"),
    validateExperienceInput,
    // validateIdParam,
    updateExperience
  )
  .delete(authenticateUser, validateIdParam, deleteExperience);

export default router;
