import { Router } from "express";
const router = Router();

import {
  getAllSkills,
  getSingleSkill,
  updateSkill,
  createSkill,
  deleteSkill,
} from "../controllers/skillsController.js";

import {
  validateIdParam,
  validateSkillInput,
} from "../middleware/validationMiddleware.js";

import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

// Routes
router
  .route("/")
  .get(getAllSkills)
  .post(
    authenticateUser,
    upload.single("imageUrl"),
    validateSkillInput,
    createSkill
  );

router
  .route("/:id")
  .get(validateIdParam, getSingleSkill)
  .patch(
    authenticateUser,
    upload.single("imageUrl"),
    validateSkillInput,
    // validateIdParam,
    updateSkill
  )
  .delete(authenticateUser, validateIdParam, deleteSkill);

export default router;
