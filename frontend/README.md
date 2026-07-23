"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar } from "lucide-react";
import Link from "next/link";
import { TextInput, FileInput, JoditEditor, DateInput } from "@/components/admin/inputs";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components";
import { customFetch } from "@/utils/customFetch";

export default function page({ params }) {
  const router = useRouter();
  const { id } = params;
  const isNewProject = id === "new";

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    imageUrl: null,
  });

  const [loading, setLoading] = useState(!isNewProject);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [currentlyWorking, setCurrentlyWorking] = useState(false);

  useEffect(() => {
    if (!isNewProject) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await customFetch.get(`/projects/${id}`);
      const project = response.data.project;

      // Check if there's no end date to determine if currently working
      const isCurrentlyWorking = !project.endDate;
      setCurrentlyWorking(isCurrentlyWorking);

      // Format dates for form inputs
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      };

      setFormData({
        name: project.name || "",
        company: project.company || "",
        position: project.position || "",
        description: project.description || "",
        startDate: formatDateForInput(project.startDate),
        endDate: formatDateForInput(project.endDate),
        imageUrl: null,
        // Store the existing image URL for preview
        existingImage:  project.imageUrl,
      });
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleCurrentlyWorkingChange = (e) => {
    const isChecked = e.target.checked;
    setCurrentlyWorking(isChecked);
    
    // Clear end date if currently working
    if (isChecked) {
      setFormData(prev => ({
        ...prev,
        endDate: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate required fields
    if (!formData.name.trim())
      errors.name = "Name is required";
    
    if (!formData.company.trim())
      errors.company = "Company is required";
      
    if (!formData.position.trim())
      errors.position = "Position is required";
    
    if (!formData.description.trim())
      errors.description = "Description is required";
    
    if (!formData.startDate)
      errors.startDate = "Start date is required";
    
    // End date is required only if not currently working
    if (!currentlyWorking && !formData.endDate)
      errors.endDate = "End date is required if not currently working";
    
    // For new experiences, image is required
    if (isNewExperience && !formData.imageUrl) {
      errors.imageUrl = "Company logo is required for new experiences";
    }

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
    
    // Only append end date if not currently working
    if (!currentlyWorking && formData.endDate) {
      formDataToSend.append("endDate", formData.endDate);
    }
    
    // Append image if available
    if (formData.imageUrl) {
      formDataToSend.append("imageUrl", formData.imageUrl);
    }

    try {
      setSaving(true);
      if (isNewExperience) {
        await customFetch.post("/projects", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success('Project has been created.');
      } else {
        await customFetch.patch(`/projects/${id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success('Project has been updated.');
      }

      // Redirect back to experience list
      router.push("/admin/projects");
    } catch (err) {
      console.error("Error saving project:", err);
      setError("Failed to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 mb-8">
      <div className="flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-serif text-gray-800">
          {isNewProject ? "Add New Project" : "Edit Project"}
        </h1>
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to Projects</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Project Title"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              error={formErrors.name}
            />
            <TextInput
              label="Project Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              error={formErrors.description}
            />
            <TextInput
              label="Project Link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              required
              error={formErrors.link}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Time Period</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TextInput
                label="Start Date"
                name="startDate"
                type="date"
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
                  checked={currentlyWorking}
                  onChange={handleCurrentlyWorkingChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="currentlyWorking" className="text-sm text-gray-700">
                  I currently work here
                </label>
              </div>
              
              {!currentlyWorking && (
                <TextInput
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required={!currentlyWorking}
                  error={formErrors.endDate}
                  disabled={currentlyWorking}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border">
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

        <div className="bg-white p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Company Logo</h2>

          <div className="grid grid-cols-1 gap-6">
            <FileInput
              label="Company Logo"
              name="imageUrl"
              onChange={handleFileChange}
              accept="image/*"
              required={isNewExperience}
              error={formErrors.imageUrl}
              previewUrl={formData.existingImage}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/projects"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer flex items-center gap-2 bg-primary/90 hover:bg-primary text-white px-4 py-2 rounded-md transition-colors disabled:opacity-70"
          >
            <Save size={18} />
            <span>{saving ? "Saving..." : "Save Project"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}





















