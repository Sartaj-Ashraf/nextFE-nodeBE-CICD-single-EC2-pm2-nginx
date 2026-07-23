"use client";

import Image from "next/image";
import Link from "next/link";
import { stripHtml } from "@/utils/generalUtils";
export default function ExperienceCard({ experience, layout = "grid" }) {
  const startDate = new Date(experience?.startDate);
  const endDate = new Date(experience?.endDate);
  // console.log({endDate})
  return (
    <Link
      href={`/experience/${experience?._id}`}
      className="border-1 border-gray-700 block w-full h-full shadow-lg rounded-xl overflow-hidden"
    >
      <div className={`flex ${layout === "list" ? "flex-row" : "flex-col"}`}>
        {/* Image container */}
        <div className={`${layout === "list" ? "w-1/3" : "w-full"} relative`}>
          {experience?.imageUrl ? (
            <div className="relative w-full">
              <Image
                src={experience?.imageUrl || "/placeholder.svg"}
                alt={experience?.name}
                width={500}
                height={300}
                className={`object-cover ${layout === "grid" ? "w-full" : ""}`}
                style={{
                  width: "100%",
                  height: layout === "grid" ? "200px" : "200px",
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
              {experience?.name}
            </h3>
            <p className="mt-2 flex-grow text-gray-400">Company: {experience?.company}</p>
            <p className="mt-2 flex-grow text-gray-400">
              Start Date: {startDate?.toLocaleDateString()} - Present
            </p>
            {experience?.endDate && (
              <p className="mt-2 flex-grow text-gray-400">
                End Date: {endDate.toLocaleDateString()}
              </p>
            )}
            <p className="mt-2 line-clamp-3 text-gray-400">
              {stripHtml(experience?.description)}
            </p>
          </div>

          <div className="mt-4 text-white rounded-2xl transition-opacity duration-300 cursor-pointer">
            View details
          </div>
        </div>
      </div>
    </Link>
  );
}
