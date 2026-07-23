"use client";

import Image from "next/image";
import Link from "next/link";
import { stripHtml } from "@/utils/generalUtils";
export default function ProjectCard({ project, layout = "grid" }) {
  const startDate = new Date(project?.startDate);
  const endDate = new Date(project?.endDate);
  console.log({project})
  return (
    <Link
      href={`/projects/${project?._id}`}
      className="block w-full h-full shadow-lg rounded-xl overflow-hidden border border-gray-700"
    >
      <div className={`flex ${layout === "list" ? "flex-row" : "flex-col"}`}>
        {/* Image container */}
        <div className={`${layout === "list" ? "w-1/3" : "w-full h-full"} relative`}>
          {project?.backgroundImage ? (
            <div className="relative w-full h-[260px]">
              <Image
                src={project?.backgroundImage || "/placeholder.svg"}
                alt={project?.name}
                width={500}
                height={300}
                className={`object-cover ${layout === "grid" ? "w-full" : "h-full"}`}
                style={{
                  width: "100%",
                  height: layout === "grid" ? "260px" : "100%",
                }}
              />
            </div>
          ) : (
            <div
              className={`${
                layout === "grid" ? "w-full h-48" : "w-full h-full"
              } bg-gray-100`}
            />
          )}
        </div>

        {/* Content container */}
        <div className="w-full flex flex-col justify-between p-6">
          <div>
            <h3 className="text-xl text-white font-semibold">
              {project?.name}
            </h3>
           
            <p className="mt-2 flex-grow text-gray-200">
              Start Date: {startDate?.toLocaleDateString()} - Present
            </p>
            {project?.endDate && (
              <p className="mt-2 flex-grow text-gray-200">
                End Date: {endDate.toLocaleDateString()}
              </p>
            )}
            <p className="mt-2 line-clamp-3 text-gray-400">
              {stripHtml(project?.description)}
            </p>
          </div>

          <div className="text-gray-300 hover:text-white mt-4 rounded-2xl transition-opacity duration-300 cursor-pointer">
            View details
          </div>
        </div>
      </div>
    </Link>
  );
}
