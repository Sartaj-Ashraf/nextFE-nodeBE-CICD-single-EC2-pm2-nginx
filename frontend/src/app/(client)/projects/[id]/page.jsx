"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Link as LinkIcon,
  Calendar,
  Edit,
  Tag,
  Code,
  ExternalLink,
} from "lucide-react";
import { customFetch } from "@/utils/customFetch";
import { LoadingSpinner } from "@/components";
import Image from "next/image";
import { getTechColor, getTechIcon } from "@/utils/projectSinglePage";
import {
  getSkillColor,
  getSkillIcon,
  getCategoryName,
} from "@/utils/projectSinglePage";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`/projects/${params.id}`);
        setProject(response.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 flex items-center gap-2 text-red-700 hover:text-red-800"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">Project not found</h2>
        <p className="text-gray-600 mb-6">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/admin/projects")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </button>
      </div>
    );
  }

  console.log({ project });
  return (
    <div className="container space-y-24 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6 text-white">
          {/* Hero section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 to-indigo-700 text-white h-48 flex items-end">
            {project.backgroundImage && (
              <Image
                src={project.backgroundImage}
                alt={`${project.name} background`}
                width={500}
                height={300}
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            <div className="relative z-10 p-6 flex items-center gap-4">
              {project.imageUrl ? (
                <div className="h-16 w-16 bg-white rounded-lg p-2 shadow-lg">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    width={500}
                    height={300}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : null}
              <div>
                <h2 className="text-2xl font-bold">{project.name}</h2>
                <div className="text-sm text-g flex items-center gap-1">
                  {/* <h1 className="text-2xl font-bold">{project.name}</h1> */}
                  <Calendar size={14} />
                  <span>
                    {formatDate(project.startDate)} -{" "}
                    {formatDate(project.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl shadow-sm border border-gray-700 p-6 ">
            <h3 className="text-lg  font-medium mb-4 ">Description</h3>
            <div className="prose max-w-none text-gray-400">
              {project.description}
            </div>
          </div>

          <div className="rounded-xl shadow-lg border border-gray-700 p-6 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold mb-5 flex items-center gap-2 text-gray-800 dark:text-white">
              <Code size={22} className="text-indigo-600" />
              Tech Stack
            </h3>

            <div className="flex flex-wrap gap-3">
              {project.techStack && project.techStack.length > 0 ? (
                project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${getTechColor(
                      tech
                    )}`}
                  >
                    <span className="mr-2">{getTechIcon(tech)}</span>
                    {tech}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No technologies specified
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="rounded-xl shadow-sm border border-gray-700 p-6 text-white">
            <h3 className="text-lg font-medium mb-4">Project Information</h3>
            <div className="space-y-4">
              {project.projectUrl && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Project URL</p>
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <LinkIcon size={16} />
                    <span className="underline">
                      {new URL(project.projectUrl).hostname}
                    </span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-400 mb-1">Duration</p>
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar size={16} className="text-gray-400" />
                  <span>
                    {formatDate(project.startDate)} -{" "}
                    {formatDate(project.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Related */}
          <div className="rounded-xl shadow-sm border border-gray-700 p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-white">
              <Tag size={18} className="text-green-600" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.skillsRelated && project.skillsRelated.length > 0 ? (
                project.skillsRelated.map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${getSkillColor(
                      skill
                    )}`}
                  >
                    <span className="mr-2">
                      {getSkillIcon(skill)}
                    </span>
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No skills specified</p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-xl p-6 border border-gray-700">
            <div className="text-sm text-gray-400">
              <p className="flex justify-between mb-2">
                <span>Created:</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </p>
              <p className="flex justify-between">
                <span>Last Updated:</span>
                <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
