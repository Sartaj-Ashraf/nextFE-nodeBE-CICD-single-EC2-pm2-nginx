import { Router } from "express";
const router = Router();

import {
  createEnquiryEntry,
  getAllEnquiryEntries,
  deleteEnquiryEntry,
} from "../controllers/enquiryController.js";
import {  validateEnquiryInput } from "../middleware/validationMiddleware.js";

// Routes

router.post("/", validateEnquiryInput, createEnquiryEntry)
router
  .route("/")
  .get(getAllEnquiryEntries)


router.route("/:id").delete(deleteEnquiryEntry);


export default router;
