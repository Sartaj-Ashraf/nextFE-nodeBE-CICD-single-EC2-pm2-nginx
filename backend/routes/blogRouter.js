import express from 'express';
import { createBlog, getAllBlogs, getBlogByTitle, updateBlog, deleteBlog, getFeaturedBlog, getBlogById } from '../controllers/blogController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Create a new blog post
router.post('/', authenticateUser, upload.single('image'),  createBlog);

// Retrieve all blog posts
router.get('/', getAllBlogs);

// Retrieve featured blog
router.get('/featured', getFeaturedBlog);

// Update an existing blog post
router.patch('/:id', authenticateUser,upload.single('image'),  updateBlog);

router.get('/:id', getBlogById);

// Retrieve a single blog post by title
router.get('/title/:title', getBlogByTitle);


// Delete a blog post
router.delete('/:id', authenticateUser,  deleteBlog);

export default router;
