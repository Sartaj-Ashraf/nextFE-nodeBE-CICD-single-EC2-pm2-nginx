"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { LoadingSpinner } from "@/components";
import { customFetch } from "@/utils/customFetch";

export default function SkillDetailsPage() {
  const { id } = useParams();

  const { data: experienceData, status } = useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      const { data } = await customFetch(`/experience/${id}`);
      return data;
    },
  });

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="py-16 text-center">
        <div className="bg-red-50 rounded-lg p-8 max-w-2xl mx-auto shadow-sm">
          <h2 className="text-2xl font-medium text-red-600 mb-3">
            Unable to load skill details
          </h2>
          <p className="text-gray-600">
            Please try again later or check your connection.
          </p>
        </div>
      </div>
    );
  }

  const { experience } = experienceData;

  return (
    <div className="py-24 container px-4 sm:px-6 lg:px-8  ">
      {/* Hero section with subtle gradient overlay */}
          <div className="relative h-80 rounded-xl overflow-hidden mb-12 shadow-lg">
          <div className="absolute inset-0 z-0">
              {experience.imageUrl ? (
                <div className="relative w-full h-full transform scale-110">
                  <Image
                    src={experience.imageUrl || "/placeholder.svg"}
                    alt="Background"
                    fill
                    className="object-cover transition-transform duration-300 ease-out hover:scale-105"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full ">
                  {/* Animated gradient shapes for visual interest */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
                    <div className="absolute w-96 h-96 rounded-full -top-20 -left-20 animate-pulse" />
                    <div
                      className="absolute w-96 h-96 rounded-full  top-1/2 right-0 animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
                    <div
                      className="absolute w-96 h-96 rounded-full  bottom-0 left-1/3 animate-pulse"
                      style={{ animationDelay: "2s" }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50 z-10">
              {/* Subtle grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
    
            <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
              <div className="max-w-4xl w-full">
                <div className="flex flex-col md:flex-row items-center bg-black/30 backdrop-blur-[4px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* Logo/Avatar section */}
                  <div className="w-full md:w-1/3 p-8 flex justify-center">
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-inner shadow-white/10 hover:scale-105 transition-transform duration-300">
                      {experience.imageUrl ? (
                        <Image
                          src={experience.imageUrl || "/placeholder.svg"}
                          alt={experience.name}
                          fill
                          className="object-contain bg-white  "
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="md:text-3xl text-xl font-bold text-white">
                            {experience.name?.charAt(0) || "D"}
                          </span>
                        </div>
                      )}
                      {/* Glowing effect around logo */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 animate" />
                    </div>
                  </div>
    
                  {/* Text content section */}
                  <div className="w-full md:w-2/3 p-8 text-center md:text-left text-white">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 ">
                      {experience.name}
                    </h1>
    
                    {experience.tagline && (
                      <p className="text-xl text-white/80 mb-6 italic">
                        {experience.tagline}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Content section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2">
          <div className=" rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="inline-block w-1 h-6 bg-indigo-500 mr-3 rounded"></span>
              About this experience
            </h2>
            <div className="prose max-w-none text-gray-400 leading-relaxed">
              <p
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: experience.description }}
              ></p>
            </div>
          </div>
        </div>

        {/* Sidebar with additional info if available */}
        <div className="space-y-6"> 
          {/* Difficulty level - display only if available */}
          {experience.difficultyLevel && (
            <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-white mb-4">Difficulty</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full" 
                    style={{ 
                      width: `${
                        experience.difficultyLevel === "Beginner" ? "33%" :
                        experience.difficultyLevel === "Intermediate" ? "66%" : "100%"
                      }` 
                    }}
                  ></div>
                </div>
                <span className="ml-3 text-sm text-gray-600">{experience.difficultyLevel || "Not specified"}</span>
              </div>
            </div>
          )}

          {/* Related skills - display only if available */}
          {experience.relatedSkills && experience.relatedSkills.length > 0 && (
            <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-white mb-4">Related Skills</h3>
              <div className="flex flex-wrap gap-2">
                {experience.relatedSkills.map((relatedSkill, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {relatedSkill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Last updated - display only if available */}
          {experience.updatedAt && (
            <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-white mb-2">Last Updated</h3>
              <p className="text-gray-400">
                {new Date(experience.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}