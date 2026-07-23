"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { customFetch } from "@/utils/customFetch";
import { JoditEditor, DatePicker } from "@/components/admin/inputs";
import { Input } from "@/components/shared/Input";
import { LoadingSpinner, ActionButtons } from "@/components";

import {
  ArrowLeft,
  Upload,
  Trash2,
  Plus,
  X,
  Calendar,
  Link as LinkIcon,
  Link2Icon,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProjectUpdatePage({ params }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(params.id ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectUrl: "",
    skillsRelated: [],
    techStack: [],
    startDate: "",
    endDate: "",
    imageUrl: null,
    backgroundImage: null,
    isFeatured: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [techInput, setTechInput] = useState("");

  // Fetch project data if editing an existing project
  useEffect(() => {
    if (params.id) {
      const fetchProject = async () => {
        try {
          const response = await customFetch.get(`/projects/${params.id}`);
          const project = response.data.project;
          console.log({ project });

          // Format dates for form inputs
          const formattedProject = {
            ...project,
            startDate: project.startDate
              ? new Date(project.startDate).toISOString().split("T")[0]
              : "",
            endDate: project.endDate
              ? new Date(project.endDate).toISOString().split("T")[0]
              : "",
            isFeatured: project.isFeatured,
          };
          setFormData(formattedProject);

          // Set image previews if available
          if (project.imageUrl) {
            setImagePreview(project.imageUrl);
          }

          if (project.backgroundImage) {
            setBackgroundImagePreview(project.backgroundImage);
          }
        } catch (err) {
          console.error("Error fetching project:", err);
          setError("Failed to load project data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProject();
    }
  }, [params.id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "imageUrl") {
          setImagePreview(reader.result);
        } else if (name === "backgroundImage") {
          setBackgroundImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding skills
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (
      skillInput.trim() &&
      !formData.skillsRelated.includes(skillInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsRelated: [...prev.skillsRelated, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  // Handle removing skills
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skillsRelated: prev.skillsRelated.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  // Handle adding tech stack
  const handleAddTech = (e) => {
    e.preventDefault();
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  // Handle removing tech stack
  const handleRemoveTech = (techToRemove) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((tech) => tech !== techToRemove),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Create FormData for multipart/form-data
      const form = new FormData();
      for (const key in formData) {
        if (key === "skillsRelated" || key === "techStack") {
          // Add array fields individually
          formData[key].forEach((item) => {
            form.append(key, item);
          });
        } else if (key === "imageUrl" || key === "backgroundImage") {
          // Only append files if they are File objects (not strings/urls)
          if (formData[key] && formData[key] instanceof File) {
            form.append(key, formData[key]);
          }
        } else if (
          key !== "_id" &&
          key !== "__v" &&
          key !== "createdAt" &&
          key !== "updatedAt" &&
          key !== "imagePublicId" &&
          key !== "backgroundPublicId"
        ) {
          // Add other fields normally, excluding MongoDB metadata fields
          form.append(key, formData[key]);
        }
      }

      let response;

      // Update existing project
      response = await customFetch.patch(`/projects/${params.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Project updated successfully!");
      router.push("/admin/projects");
    } catch (err) {
      console.error("Error saving project:", err);
      toast.error(
        `Failed to update project. Please check your inputs and try again.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 text-white">
      <div className="flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-serif ">Edit Project</h1>
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to Projects</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
          {successMessage}
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className=" rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-medium mb-6">Project Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                type="text"
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter project name"
                className="w-full"
              />
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 top-7 left-0 pl-3 flex items-center pointer-events-none">
                  <Link2Icon size={16} className="text-white" />
                </div>
                <Input
                  type="url"
                  label="Project URL"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <JoditEditor
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">
                <Calendar size={16} className="inline mr-1" />
                Start Date
              </label>
              <DatePicker
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar size={16} className="inline mr-1" />
                End Date (leave empty for ongoing)
              </label>
              <DatePicker
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className=" rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-medium mb-6">Technologies & Skills</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tech Stack
              </label>
              <div className="flex">
                <Input
                  type="text"
                  name="techInput"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add a technology"
                  className="flex-grow"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="ml-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {formData.techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Skills Related
              </label>
              <div className="flex">
                <Input
                  type="text"
                  name="skillInput"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-grow"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="ml-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skillsRelated.map((skill, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-medium mb-6">Images</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Logo/Icon
              </label>

              <div className="flex items-center space-x-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Project logo preview"
                      className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, imageUrl: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-sm">No logo</span>
                  </div>
                )}

                <div>
                  <label className="block">
                    <span className="sr-only">Choose project logo</span>
                    <input
                      type="file"
                      name="imageUrl"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.querySelector('input[name="imageUrl"]').click()
                      }
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Upload size={16} />
                      {imagePreview ? "Change Logo" : "Upload Logo"}
                    </button>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Background Image
              </label>

              <div className="flex items-center space-x-4">
                {backgroundImagePreview ? (
                  <div className="relative">
                    <img
                      src={backgroundImagePreview}
                      alt="Background image preview"
                      className="h-24 w-36 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setBackgroundImagePreview(null);
                        setFormData((prev) => ({
                          ...prev,
                          backgroundImage: null,
                        }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-36 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-sm">No background</span>
                  </div>
                )}

                <div>
                  <label className="block">
                    <span className="sr-only">Choose background image</span>
                    <input
                      type="file"
                      name="backgroundImage"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .querySelector('input[name="backgroundImage"]')
                          .click()
                      }
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Upload size={16} />
                      {backgroundImagePreview
                        ? "Change Background"
                        : "Upload Background"}
                    </button>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" p-6 rounded-md shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Set as Featured</h2>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              name="isFeatured"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isFeatured" className="text-sm text-gray-300">
              Set as featured
            </label>
          </div>
        </div>

        <ActionButtons isLoading={isSaving} submitLabel="Update Project" />
      </form>
    </div>
  );
}
