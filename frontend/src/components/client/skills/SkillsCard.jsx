"use client";

import Image from "next/image";
import Link from "next/link";

export default function SkillsCard({ skill, layout = "grid" }) {
  return (
    <Link
      href={`/skills/${skill?._id}`}
      className="border-1 border-gray-700 block w-full h-full shadow-lg rounded-xl overflow-hidden"
    >
      <div className={`flex ${layout === "list" ? "flex-row" : "flex-col"}`}>
        {/* Image container */}
        <div 
          className={`${layout === "list" ? "w-1/3" : "w-full"} relative`}
        >
          {skill?.imageUrl ? (
            <div className="relative w-full">
              <Image
                src={skill?.imageUrl || "/placeholder.svg"}
                alt={skill?.name}
                width={500}
                height={300}
                className={`object-cover ${layout === "grid" ? "w-full" : ""}`}
                style={{
                  width: '100%',
                  height: layout === "grid" ? '200px' : '200px'
                }}
              />
            </div>
          ) : (
            <div className={`${layout === "grid" ? "w-full h-48" : "w-full h-full"} bg-gray-100`} />
          )}
        </div>
        
        {/* Content container */}
        <div className="text-white w-full flex flex-col justify-between p-6">
          <div>
            <h3 className="text-xl font-semibold">{skill?.name}</h3>
            <p
              className="mt-2 flex-grow line-clamp-3 text-gray-400"
              dangerouslySetInnerHTML={{ __html: skill?.description }}
            ></p>
          </div>
        
          <div className=" text-gray-300 hover:text-gray-200 mt-4 rounded-2xl transition-opacity duration-300 cursor-pointer ">
            View details
          </div>
        </div>
      </div>
    </Link>
  );
}