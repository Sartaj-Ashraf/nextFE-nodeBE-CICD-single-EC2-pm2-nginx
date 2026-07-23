import "express-async-errors";

//  config env
import * as dotenv from "dotenv";
dotenv.config();

// create app
import express from "express";
const app = express();

// packages
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cors from "cors";
//routers
import authRouter from "./routes/authRouter.js";
import skillRouter from "./routes/skillsRouter.js";
import experienceRouter from "./routes/experienceRouter.js";
import projectRouter from "./routes/projectRouter.js";
import techStackRouter from "./routes/techStackRouter.js";
import enquiryRouter from "./routes/enquiryRouter.js";
import blogRouter from "./routes/blogRouter.js";
//public
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//middleware
import errorHandlerMiddleware from "./middleware/errorhandlerMiddleware.js";

// cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.ENABLE_MORGAN) {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.PRODUCTION_URL2, process.env.PRODUCTION_URL1],
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS","PATCH"],
    credentials: true,
  })
);
app.use("/api/v1/health", (req, res) => {
  res.status(200).json({ msg: "Health check passed" });
});

// use routes here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/skills", skillRouter);
app.use("/api/v1/experience", experienceRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/techStack", techStackRouter);
app.use("/api/v1/enquiry", enquiryRouter);
app.use("/api/v1/blogs", blogRouter);
// entry point prod...
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

//not found
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route not found " });
});

//err HANDLING  middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server listening on ${port}...`);
  });
} catch (error) {
  console.log({ error });
  process.exit(1);
}


