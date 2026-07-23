// Import necessary modules
import PortfolioBlog from "../models/blogModel.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multer.js";
import { UnauthorizedErr } from "../errors/customErors.js";

// Create a new blog post
const createBlog = async (req, res) => {
  if (req.user.role !== "admin")
    throw new UnauthorizedErr("you are not authorized to access this route");
  try {
    const newBlog = new PortfolioBlog({
      ...req.body,
    });

    if (req.file) {
      const file = formatImage(req.file);
      const response = await cloudinary.v2.uploader.upload(file);
      newBlog.image = response.secure_url;
      newBlog.imageId = response.public_id;
    }
    const savedBlog = await PortfolioBlog.create(newBlog);
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve all blog posts
const getAllBlogs = async (req, res) => {
  try {
    const {
      search_term,
      start_date,
      end_date,
      sort_by = "newest", // default to newest
    } = req.query;

    const query_object = {};

    // Enhanced search functionality
    if (search_term) {
      query_object.$or = [{ title: { $regex: search_term, $options: "i" } }];
    }

    // Date range filtering
    if (start_date || end_date) {
      query_object.createdAt = {};

      if (start_date) {
        // Parse start date and set to beginning of day
        const start = new Date(start_date);
        start.setHours(0, 0, 0, 0);
        query_object.createdAt.$gte = start;
      }

      if (end_date) {
        // Parse end date and set to end of day
        const end = new Date(end_date);
        end.setHours(23, 59, 59, 999);
        query_object.createdAt.$lte = end;
      }
    }

    // Setup sorting
    let sort_object = {};
    switch (sort_by) {
      case "newest":
        sort_object = { createdAt: -1 };
        break;
      case "oldest":
        sort_object = { createdAt: 1 };
        break;
      case "name":
        sort_object = { name: 1 };
        break;
      case "name-desc":
        sort_object = { name: -1 };
        break;
      default:
        sort_object = { createdAt: -1 }; // default to newest
    }
    const [blogs, total_blogs] = await Promise.all([
      PortfolioBlog.find(query_object).sort(sort_object),
      PortfolioBlog.countDocuments(query_object),
    ]);
    res.status(200).json({
      blogs,
      total_blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedBlog = async (req, res) => {
  try {
    const blog = await PortfolioBlog.find({ isfeatured: true })
      .sort({ createdAt: -1 })
      .limit(3);

    if (!blog)
      return res.status(404).json({ message: "Featured blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await PortfolioBlog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .trim();
};

const getBlogByTitle = async (req, res) => {
  try {
    const titleSlug = req.params.title;

    // Option 1: If you have a slug field in your database
    let blog = await PortfolioBlog.findOne({ slug: titleSlug });

    // Option 2: If you don't have slug field, convert slug back to title and search
    if (!blog) {
      const searchTitle = titleSlug.replace(/-/g, " ");

      blog = await PortfolioBlog.findOne({
        title: { $regex: new RegExp(`^${searchTitle}$`, "i") },
      });
    }

    // Option 3: Search by partial title match (more flexible)
    if (!blog) {
      const search_terms = titleSlug.replace(/-/g, " ").split(" ");
      const regex_pattern = search_terms.map((term) => `(?=.*${term})`).join("");

      blog = await PortfolioBlog.findOne({
        title: { $regex: new RegExp(regex_pattern, "i") },
      });
    }

    // Option 4: Fallback - find all blogs and match manually (for debugging)
    if (!blog) {
      const allBlogs = await PortfolioBlog.find({}, { title: 1, _id: 1 });

      // Try to find by matching the generated slug
      blog = allBlogs.find((b) => createSlug(b.title) === titleSlug);
      if (blog) {
        // Get full blog data
        blog = await PortfolioBlog.findById(blog._id);
        console.log("✅ Found by slug matching:", blog ? "YES" : "NO");
      }
    }

    if (!blog) {
      console.log("❌ Blog not found after all attempts");
      return res.status(404).json({ message: "Blog not found" });
    }

    console.log("✅ Blog found:", blog.title);
    res.status(200).json(blog);
  } catch (error) {
    console.error("💥 Error in getBlogByTitle:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing blog post
const updateBlog = async (req, res) => {
  if (req.user.role !== "admin")
    throw new UnauthorizedErr("you are not authorized to access this route");
  try {
    const { id } = req.params;
    const blog = await PortfolioBlog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const updateData = { ...req.body };

    if (req.file) {
      // Delete old image if exists
      if (blog.imageId) {
        await cloudinary.v2.uploader.destroy(blog.imageId);
      }
      // Upload new image
      const file = formatImage(req.file);
      const response = await cloudinary.v2.uploader.upload(file);
      updateData.image = response.secure_url;
      updateData.imageId = response.public_id;
    }

    const updatedBlog = await PortfolioBlog.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a blog post
const deleteBlog = async (req, res) => {
  if (req.user.role !== "admin")
    throw new UnauthorizedErr("you are not authorized to access this route");
  try {
    const { id } = req.params;
    const blog = await PortfolioBlog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete image from Cloudinary if exists
    if (blog.imageId) {
      await cloudinary.v2.uploader.destroy(blog.imageId);
    }

    // Delete blog from database
    await PortfolioBlog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog and image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export the functions
export {
  createBlog,
  getAllBlogs,
  getFeaturedBlog,
  getBlogById,
  getBlogByTitle,
  updateBlog,
  deleteBlog,
};
