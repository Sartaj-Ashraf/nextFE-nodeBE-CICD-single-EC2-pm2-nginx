
import Link from "next/link";

import { formatDate } from "@/utils/formatDate";
import { createSlug } from "@/utils/createSlug";

// Single Blog Card Component
export default function AllLatestblogsCard({ blog }) {
  return (
    <div className="relative p-3 bg-[var(--bs-card-bg)] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col justify-between h-[100%]">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-64 object-cover rounded-lg"
      />
      <div className="absolute top-4 left-4">
        <span
          className={`px-3 py-1 rounded-full text-sm text-white
            ${blog.category === "History" ? "bg-yellow-500" : ""}
            ${blog.category === "Research" ? "bg-purple-500" : ""}
            ${blog.category === "Business" ? "bg-red-500" : ""}
            ${blog.category === "Technology" ? "bg-blue-500" : ""}
            ${blog.category === "Adventure" ? "bg-gray-800" : ""}
            ${blog.category === "Hotel Service" ? "bg-green-500" : ""}`}
        >
          {blog.category}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold font-sans mb-2 transition-colors line-clamp-2">
          {blog?.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm"> {formatDate(blog?.createdAt)}</div>
          <Link
            href={`/blogs/blog/${createSlug({title: blog?.title})}`}
            className="text-blue-400 hover:text-blue-300"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
}
