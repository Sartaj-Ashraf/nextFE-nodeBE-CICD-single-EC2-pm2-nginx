"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { formatDate } from "@/utils/formatDate";
import {customFetch} from "@/utils/customFetch";
import { createSlug } from "@/utils/createSlug";

import { Calendar } from "lucide-react";

// Recent Posts Component
const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await customFetch.get("/blogs/featured");
        setBlogs(data);
        console.log({ data });
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 ">
      {blogs?.map((blog, index) => (
        <div key={index} className="flex gap-4 items-center backdrop-blur-xs p-1">
          <img
            src={blog?.image}
            alt={blog?.title}
            className="w-32 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold font-sans  mb-2 line-clamp-2">
              {blog?.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog?.createdAt)}</span>
              </div>
              <div className="text-blue-400">
                <Link
                  href={`/blogs/blog/${createSlug({ title: blog?.title })}`}
                >
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default FeaturedBlogs;
