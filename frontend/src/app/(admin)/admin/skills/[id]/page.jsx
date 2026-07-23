"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { customFetch } from "@/utils/customFetch";
import {FileInput, JoditEditor } from "@/components/admin/inputs";
import { Input } from "@/components/shared/Input";
import { LoadingSpinner ,ActionButtons} from "@/components";


import { ArrowLeft } from "lucide-react";

export default function page({params}) {
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isFeatured: false,
    imageUrl: null,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchSkill();
  }, [id]);

  const fetchSkill = async () => {
    try {
      setLoading(true);
      const {data} = await customFetch.get(`/skills/${id}`);
      const skill = data.skill;

      setFormData({
        name: skill.name,
        description: skill.description,
        imageUrl: null,
        // Store the existing image URL for preview
        existingImage: skill.imageUrl,
      });
    } catch (err) {
      console.error("Error fetching skill:", err);
      setError("Failed to load skill details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate required fields
    if (!formData.name.trim()) errors.name = "Name is required";

    if (!formData.description.trim())
      errors.description = "Description is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      await customFetch.patch(`/skills/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Skill has been updated.");
      // Redirect back to skills list
      router.push("/admin/skills");
    } catch (err) {
      console.error("Error saving skill:", err);
      setError("Failed to save skill. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 mb-8 text-white">
      <div className="flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-serif ">Edit Skill</h1>
        <Link
          href="/admin/skills"
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to Skills</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className=" p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 gap-4">
            <Input
              type="text"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              error={formErrors.name}
            />
          </div>
        </div>

        <div className=" p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Description</h2>

          <div className="space-y-6">
            <JoditEditor
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              error={formErrors.description}
            />
          </div>
        </div>

        <div className=" p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Media</h2>

          <div className="grid grid-cols-1 gap-6">
            <FileInput
              label="Skill Image"
              name="imageUrl"
              onChange={handleFileChange}
              accept="image/*"
              required
              error={formErrors.imageUrl}
              previewUrl={formData.existingImage}
            />
          </div>
        </div>
        <div className=" p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Set as Featured</h2>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              name="isFeatured"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isFeatured" className="text-sm text-gray-300">
              Set as featured
            </label>
          </div>
        </div>

        <ActionButtons isLoading={saving} submitLabel="Update Skill" />
      </form>
    </div>
  );
}
