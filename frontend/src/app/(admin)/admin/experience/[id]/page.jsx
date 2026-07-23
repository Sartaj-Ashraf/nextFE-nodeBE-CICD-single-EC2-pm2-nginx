"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  FileInput,
  JoditEditor,
} from "@/components/admin/inputs";
import { Input } from "@/components/shared/Input";
import { LoadingSpinner, ActionButtons } from "@/components";
import { customFetch } from "@/utils/customFetch";

import { ArrowLeft } from "lucide-react";

export default function page({ params }) {
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    imageUrl: null,
    isFeatured: false,
    isCurrentlyWorking: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const response = await customFetch.get(`/experience/${id}`);
      const experience = response.data.experience;

      // Format dates for form inputs
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD format
      };

      setFormData({
        name: experience.name || "",
        company: experience.company || "",
        position: experience.position || "",
        description: experience.description || "",
        startDate: formatDateForInput(experience.startDate),
        endDate: formatDateForInput(experience.endDate),
        imageUrl: null,
        isFeatured: experience.isFeatured,
        isCurrentlyWorking: experience.isCurrentlyWorking,
        existingImage: experience.imageUrl,
      });
    } catch (err) {
      console.error("Error fetching experience:", err);
      setError("Failed to load experience details. Please try again.");
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

    if (!formData.company.trim()) errors.company = "Company is required";

    if (!formData.position.trim()) errors.position = "Position is required";

    if (!formData.description.trim())
      errors.description = "Description is required";

    if (!formData.startDate) errors.startDate = "Start date is required";

    // End date is required only if not currently working
    if (!formData.isCurrentlyWorking && !formData.endDate)
      errors.endDate = "End date is required if not currently working";

    // Validate that end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        errors.endDate = "End date must be after start date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create a copy of form data to send
    const formDataToSend = new FormData();

    // Append all text fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("company", formData.company);
    formDataToSend.append("position", formData.position);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("isCurrentlyWorking", formData.isCurrentlyWorking);
    formDataToSend.append("isFeatured", formData.isFeatured);

    // Only append end date if not currently working
    if (!formData.isCurrentlyWorking && formData.endDate) {
      formDataToSend.append("endDate", formData.endDate);
    }

    // Append image if available
    if (formData.imageUrl) {
      formDataToSend.append("imageUrl", formData.imageUrl);
    }

    try {
      setSaving(true);

      await customFetch.patch(`/experience/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Experience has been updated.");
      // Redirect back to experience list
      router.push("/admin/experience");
    } catch (err) {
      console.error("Error saving experience:", err);
      setError("Failed to save experience. Please try again.");
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
        <h1 className="text-3xl font-serif ">Edit Experience</h1>
        <Link
          href="/admin/experience"
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to Experience</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Experience Title"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              error={formErrors.name}
            />
            <Input
              type="text"
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
              error={formErrors.company}
            />
            <Input
              type="text"
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
              error={formErrors.position}
            />
          </div>
        </div>

        <div className=" p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Time Period</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                error={formErrors.startDate}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="currentlyWorking"
                  checked={formData.isCurrentlyWorking}
                  onChange={handleInputChange}
                  name="isCurrentlyWorking"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="currentlyWorking"
                  className="text-sm text-gray-300"
                >
                  I currently work here
                </label>
              </div>

              {!formData.isCurrentlyWorking && (
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required={!formData.isCurrentlyWorking}
                  error={formErrors.endDate}
                  disabled={formData.isCurrentlyWorking}
                />
              )}
            </div>
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
          <h2 className="text-lg font-semibold mb-4">Company Logo</h2>

          <div className="grid grid-cols-1 gap-6">
            <FileInput
              label="Company Logo"
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

        <ActionButtons isLoading={saving} submitLabel="Update Experience" />
      </form>
    </div>
  );
}
