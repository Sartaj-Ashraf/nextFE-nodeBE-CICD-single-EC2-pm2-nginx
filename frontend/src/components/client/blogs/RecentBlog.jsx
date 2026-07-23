"use client";
import Link from "next/link";

import { createSlug } from "@/utils/createSlug";
import { formatDate } from "@/utils/formatDate";

import { Calendar } from "lucide-react";

const RecentBlog = ({ recentBlog }) => {

  return (
    <div className=" backdrop-blur-xs rounded-[10px] overflow-hidden">
      <div className="relative">
        <img
          src={recentBlog?.image}
          alt={recentBlog?.title}
          className="w-full h-64 object-cover"
        />
      </div>
      <div className="py-6">
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formatDate(recentBlog?.createdAt)}</span>
        </div>
        <h2 className="font-bold leading-snug mb-2 line-clamp-2">
          {recentBlog?.title}
        </h2>

        <div className="flex items-center justify-between text-blue-400">
          <Link href={`/blogs/blog/${createSlug({title: recentBlog?.title})}`}>
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentBlog;
