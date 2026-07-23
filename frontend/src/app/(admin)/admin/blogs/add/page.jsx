"use client";
import React, { useState, useCallback, useMemo } from "react";
import JoditEditor from "jodit-react";
import {customFetch} from "@/utils/customFetch";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { FaBlog, FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_TAGS = 10;

const AddBlogs = () => {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    tagInput: ""
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateImage = useCallback((file) => {
    const errors = [];
    
    if (!file) return errors;
    
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errors.push("Please select a valid image file (JPEG, PNG, or WebP)");
    }
    
    if (file.size > MAX_FILE_SIZE) {
      errors.push("Image size must be less than 5MB");
    }
    
    return errors;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    
    const imageErrors = validateImage(image);
    if (imageErrors.length > 0) {
      newErrors.image = imageErrors[0];
    }
    
    return newErrors;
  }, [formData.title, formData.content, image, validateImage]);

  // Event handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  }, [errors]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }
    
    const imageErrors = validateImage(file);
    if (imageErrors.length > 0) {
      setErrors(prev => ({
        ...prev,
        image: imageErrors[0]
      }));
      return;
    }
    
    setImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    
    // Clear image error
    setErrors(prev => ({
      ...prev,
      image: ""
    }));
  }, [validateImage]);

  const addTag = useCallback(() => {
    const trimmedTag = formData.tagInput.trim().toLowerCase();
    
    if (!trimmedTag) {
      toast.warning("Please enter a tag");
      return;
    }
    
    if (formData.tags.length >= MAX_TAGS) {
      toast.warning(`Maximum ${MAX_TAGS} tags allowed`);
      return;
    }
    
    if (formData.tags.includes(trimmedTag)) {
      toast.warning("Tag already exists");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, trimmedTag],
      tagInput: ""
    }));
  }, [formData.tagInput, formData.tags]);

  const removeTag = useCallback((tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  // Form submission with proper FormData handling
  const createFormDataPayload = useCallback(() => {
    const payload = new FormData();
    
    // Add text fields
    payload.append("title", formData.title.trim());
    payload.append("content", formData.content.trim());
    
    // Add image if present
    if (image) {
      payload.append("image", image, image.name);
    }
    
    formData.tags.forEach((tag, index) => {
      payload.append(`tags[${index}]`, tag);
    });
    
    return payload;
  }, [formData, image]);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      content: "",
      tags: [],
      tagInput: ""
    });
    setImage(null);
    setImagePreview(null);
    setErrors({});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = createFormDataPayload();
     await customFetch.post("/blogs", payload);
      toast.success("Blog created successfully!");
      resetForm();
      router.push("/admin/blogs");
      
    } catch (err) {
      console.error("Blog creation error:", err);
      
      // Handle different types of errors
      if (err.response?.status === 413) {
        toast.error("File too large. Please choose a smaller image.");
      } else if (err.response?.status === 422) {
        toast.error("Invalid data. Please check your inputs.");
      } else if (err.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to create blog. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-white p-6 shadow-lg">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <FaBlog className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-gray-700">Add New Blog</h2>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 mt-4">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Title Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-5 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all placeholder-gray-400 ${
                errors.title 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter blog title"
              maxLength={200}
              required
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Content Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <div className={`border rounded-xl ${errors.content ? 'border-red-300' : 'border-gray-300'}`}>
              <JoditEditor
                value={formData.content}
                onChange={(newContent) => handleInputChange('content', newContent)}
                // config={{
                //   readonly: false,
                //   height: 400,
                //   placeholder: 'Write your blog content here...'
                // }}
              />
            </div>
            {errors.content && (
              <p className="mt-2 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Cover Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              onChange={handleImageChange}
              className={`w-full px-5 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                errors.image 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.image && (
              <p className="mt-2 text-sm text-red-600">{errors.image}</p>
            )}
            
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <MdDelete className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tags Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Tags ({formData.tags.length}/{MAX_TAGS}) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={formData.tagInput}
                onChange={(e) => handleInputChange('tagInput', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag"
                className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                maxLength={30}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!formData.tagInput.trim() || formData.tags.length >= MAX_TAGS}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FaPlus className="w-5 h-5" />
                Add Tag
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 px-4 py-2 rounded-full flex items-center gap-2 text-blue-700 font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="col-span-10 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block w-5 h-5 border-4 border-white border-t-transparent rounded-full"></span>
                Creating Blog...
              </>
            ) : (
              "Create Blog"
            )}
          </button>
          <Link
            href="/admin/blogs"
            className="col-span-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancel
          </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogs;