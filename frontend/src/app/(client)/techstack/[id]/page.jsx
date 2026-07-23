"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { customFetch } from "@/utils/customFetch";
import { LoadingSpinner } from "@/components";
import Image from "next/image";
import Link from "next/link";
export default function TechStackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [techStack, setTechStack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`/techStack/${params.id}`);
        setTechStack(response.data.techStack);
      } catch (err) {
        console.error("Error fetching techStack:", err);
        setError("Failed to load techStack details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTechStack();
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

  if (!techStack) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">TechStack not found</h2>
        <p className="text-gray-600 mb-6">
          The techStack you're looking for doesn't exist or has been removed.
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

  console.log({ techStack });
  return (
    <section className="container space-y-24 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6 text-white">
          {/* Hero section */}
          <div className="relative overflow-hidden rounded-xl  text-white h-48 flex items-end">
            {techStack.imageUrl && (
              <Image
                src={techStack.imageUrl}
                alt={`${techStack.name} background`}
                width={500}
                height={300}
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            <div className="relative z-10 p-6 flex items-center gap-4">
              {techStack.imageUrl ? (
                <div className="h-16 w-16 bg-white rounded-lg p-2 shadow-lg">
                  <Image
                    src={techStack.imageUrl}
                    alt={techStack.name}
                    width={500}
                    height={300}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : null}
              <div>
                <h2 className="text-2xl font-bold">{techStack.name}</h2>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl shadow-sm border border-gray-700 p-6 ">
            <h3 className="text-lg  font-medium mb-4 ">Description</h3>
            <div className="prose max-w-none text-gray-400" dangerouslySetInnerHTML={{ __html: techStack.description }}></div>
          </div>
          <Link href={`${techStack.refrenceLink}`} className="text-blue-500 hover:underline" target="_blank">Know more this technology</Link>
        </div>
      </div>
    </section>
  );
}
