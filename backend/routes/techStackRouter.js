import { Router } from "express";
const router = Router();

import {
  getAllTechStacks,
  getSingleTechStack,
  updateTechStack,
  createTechStack,
  deleteTechStack,
} from "../controllers/techStackController.js";

import {
  validateIdParam,
  validateTechStackInput,
} from "../middleware/validationMiddleware.js";

import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

// Routes
router
  .route("/")
  .get(getAllTechStacks)
  .post(
    authenticateUser,
    upload.single("imageUrl"),
    validateTechStackInput,
    createTechStack
  );

router
  .route("/:id")
  .get(validateIdParam, getSingleTechStack)
  .patch(
    authenticateUser,
    upload.single("imageUrl"),
    validateTechStackInput,
    updateTechStack
  )
  .delete(authenticateUser, validateIdParam, deleteTechStack);

export default router;
