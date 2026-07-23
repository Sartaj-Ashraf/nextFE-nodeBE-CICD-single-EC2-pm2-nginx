"use client";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { createSlug } from "@/utils/createSlug";
import {customFetch} from "@/utils/customFetch";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  User,
  Eye,
  BookOpen,
  X,
} from "lucide-react";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const BlogsHome = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch blogs function
  const fetchBlogsData = useCallback(async (search = "") => {
    try {
      // Show searching indicator only if it's a search operation
      if (search) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const { data } = await customFetch.get("/blogs", {
        params: search ? { searchTerm: search } : {},
      });
      setBlogs(data.blogs || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to fetch blogs");
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBlogsData();
  }, [fetchBlogsData]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      fetchBlogsData(debouncedSearchTerm);
    } else {
      // If search is cleared, fetch all blogs
      fetchBlogsData();
    }
  }, [debouncedSearchTerm, fetchBlogsData]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Delete handlers
  const openDeleteDialog = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setBlogToDelete(null);
    setShowDeleteDialog(false);
  };

  const deleteBlog = async () => {
    try {
      setLoading(true);
      await customFetch.delete(`/blogs/${blogToDelete._id}`);
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogToDelete._id));
      toast.success("Blog deleted successfully");
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete blog");
    } finally {
      setLoading(false);
      closeDeleteDialog();
    }
  };

  // Clear search handler
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Blog Card Component
  const BlogCard = ({ blog }) => (
    <div className="group bg-white rounded-md shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/placeholder-blog-image.jpg"; // Fallback image
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link
            href={`/blogs/blog/${createSlug({ title: blog.title })}`}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </Link>
          <Link
            href={`/admin/blogs/update-blog/${blog._id}`}
            className="p-2 bg-blue-500/90 backdrop-blur-sm rounded-full hover:bg-blue-600 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-white" />
          </Link>
          <button
            onClick={() => openDeleteDialog(blog)}
            className="p-2 bg-red-500/90 backdrop-blur-sm rounded-full hover:bg-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <Link href={`/blogs/blog/${createSlug({ title: blog.title })}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
            >
              {tag}
            </span>
          ))}
          {blog.tags?.length > 3 && (
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              +{blog.tags.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Oasisascend</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Delete Dialog Component
  const DeleteDialog = () => {
    if (!showDeleteDialog) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full ">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Delete Blog
                </h3>
                <p className="text-gray-600 text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "
              <strong
                dangerouslySetInnerHTML={{ __html: blogToDelete?.title }}
              />
              "?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={deleteBlog}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading && !searching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !blogs.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchBlogsData();
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 ">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                Blog Management
              </h1>
              <p className="text-gray-600 mt-2">
                Create, manage, and organize your blog posts
              </p>
            </div>
            <Link
              href="/admin/blogs/add"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Search status */}
          {searchTerm && (
            <div className="text-sm text-gray-600">
              {searching
                ? "Searching..."
                : `Found ${blogs.length} result${
                    blogs.length !== 1 ? "s" : ""
                  } for "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pb-12">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {searchTerm ? "No matching blogs found" : "No blogs yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? `No blogs match your search for "${searchTerm}". Try different keywords.`
                : "Get started by creating your first blog post"}
            </p>
            {searchTerm ? (
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <Link
                href="/admin/blogs/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create First Blog
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <div
                key={blog._id}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards opacity-0",
                }}
              >
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteDialog />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogsHome;
