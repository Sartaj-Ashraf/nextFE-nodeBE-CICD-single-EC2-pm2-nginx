"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Link from "next/link";

import { customFetch } from "@/utils/customFetch";
import { Input } from "@/components/shared/Input";
import { FileInput } from "@/components/admin/inputs";
import { ActionButtons } from "@/components";
const JoditEditor = dynamic(
  () => import("@/components/admin/inputs/JoditEditor"),
  {
    ssr: false,
  }
);

import { ArrowLeft, Trash2, Upload } from "lucide-react";

const AddTechStack = () => {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: null,
    refrenceLink: "",
    isFeatured: false,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  console.log({ formData });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const form = new FormData();
    for (const key in formData) {
      if (key === "imageUrl") {
        if (formData[key] instanceof File) {
          form.append(key, formData[key]);
        }
      } else {
        form.append(key, formData[key]);
      }
    }
    console.log({ form });
    try {
      const response = await customFetch.post("/techStack", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log({ response });
      setIsSaving(false);
      toast.success("Tech Stack added successfully");
      router.push("/admin/techstack");
    } catch (error) {
      console.error("Error adding tech stack:", error);
      setIsSaving(false);
      toast.error("Failed to add tech stack. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center border-b pb-6 text-white">
        <h1 className="text-3xl font-serif ">Add TechStack</h1>
        <Link
          href="/admin/techstack"
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to TechStack</span>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div>
          <Input
            type="text"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <JoditEditor
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Input
            type="text"
            label="Refrence Link"
            name="refrenceLink"
            value={formData.refrenceLink}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <div className="grid grid-cols-1 gap-6 border p-6 rounded-md shadow-sm">
            <FileInput
              label="Tech Logo/Icon"
              name="imageUrl"
              onChange={handleImageChange}
              accept="image/*"
              true
              previewUrl={imagePreview}
            />
          </div>
        </div>
        <div className=" p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">
            Set as Featured
          </h2>
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
        <ActionButtons isLoading={isSaving} submitLabel="Create TechStack" />
      </form>
    </div>
  );
};

export default AddTechStack;
