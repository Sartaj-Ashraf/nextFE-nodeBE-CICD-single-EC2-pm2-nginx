"use client";

import Image from "next/image";
import Link from "next/link";
import { stripHtml } from "@/utils/generalUtils";
export default function TechStackCard({ techStack, layout = "grid" }) {
  return (
    <Link
      href={`/techstack/${techStack?._id}`}
      className="block w-full h-full shadow-lg rounded-xl overflow-hidden border border-gray-700"
    >
      <div className={`flex ${layout === "list" ? "flex-row" : "flex-col"}`}>
        {/* Image container */}
        <div className={`${layout === "list" ? "w-1/2" : "w-full h-full"} relative`}>
          {techStack?.imageUrl ? (
            <div className="relative w-full h-[200px]">
              <Image
                src={techStack?.imageUrl || "/placeholder.svg"}
                alt={techStack?.name}
                width={500}
                height={300}
                className={`object-cover ${layout === "grid" ? "w-full" : "h-full"}`}
                style={{
                  width: "100%",
                  height: layout === "grid" ? "200px" : "100%",
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
              {techStack?.name}
            </h3>
            <p className="mt-2 line-clamp-3 text-gray-400">
              {stripHtml(techStack?.description)}
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
