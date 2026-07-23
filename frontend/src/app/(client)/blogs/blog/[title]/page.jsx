"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

import {customFetch} from "@/utils/customFetch";
import { formatDate } from "@/utils/formatDate";
import "./styles.css";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { title: titleSlug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await customFetch.get(`/blogs/title/${titleSlug}`);
        setBlog(data);
        console.log({ data });

        // Update document title for SEO
        if (data?.title) {
          document.title = `${data.title} | Your Site Name`;

          // Update meta description
          const metaDescription = document.querySelector(
            'meta[name="description"]'
          );
          if (metaDescription) {
            metaDescription.setAttribute(
              "content",
              data.excerpt ||
                extractTextFromHTML(data.content)?.substring(0, 160) ||
                ""
            );
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };

    if (titleSlug) {
      fetchData();
    }
  }, [titleSlug]); // Changed dependency from [] to [titleSlug]

  // Helper function to extract text from HTML
  const extractTextFromHTML = (html) => {
    if (typeof window === "undefined") return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  function calculateReadingTime(html, wordsPerMinute = 200) {
    if (!html) return "Less than a min";

    const textContent = extractTextFromHTML(html);

    // Calculate word count
    const wordCount = textContent
      .trim()
      .split(/\s+/) // Split by whitespace
      .filter((word) => word.length > 0).length; // Filter out empty strings

    // Calculate reading time in minutes
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

    // Format the reading time
    if (readingTimeMinutes === 0) {
      return "Less than a min";
    } else if (readingTimeMinutes === 1) {
      return "1 min";
    } else {
      return `${readingTimeMinutes} mins`;
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Blog post not found</p>
        <Link
          href="/blogs"
          className="bg-teal-400 text-white px-6 py-3 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-900">
      <Head>
        <title>{blog.title} | Oasis Ascend</title>
        <meta
          name="description"
          content={
            blog.excerpt ||
            extractTextFromHTML(blog.content)?.substring(0, 160) ||
            ""
          }
        />
        <meta name="keywords" content={blog.tags?.join(", ") || ""} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${titleSlug}`}
        />
        <meta property="og:title" content={blog.title} />
        <meta
          property="og:description"
          content={
            blog.excerpt ||
            extractTextFromHTML(blog.content)?.substring(0, 160) ||
            ""
          }
        />
        <meta
          property="og:image"
          content={blog.image || "/default-blog-image.jpg"}
        />
        <meta property="article:published_time" content={blog.createdAt} />
        <meta
          property="article:author"
          content={blog.author || "Your Site Name"}
        />
        <meta property="article:tag" content={blog.tags?.join(", ") || ""} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${titleSlug}`}
        />
        <meta property="twitter:title" content={blog.title} />
        <meta
          property="twitter:description"
          content={
            blog.excerpt ||
            extractTextFromHTML(blog.content)?.substring(0, 160) ||
            ""
          }
        />
        <meta
          property="twitter:image"
          content={blog.image || "/default-blog-image.jpg"}
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${titleSlug}`}
        />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description:
              blog.excerpt ||
              extractTextFromHTML(blog.content)?.substring(0, 160) ||
              "",
            image: blog.image,
            author: {
              "@type": "Person",
              name: blog.author || "Your Site Name",
            },
            publisher: {
              "@type": "Organization",
              name: "Your Site Name",
              logo: {
                "@type": "ImageObject",
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
              },
            },
            datePublished: blog.createdAt,
            dateModified: blog.updatedAt || blog.createdAt,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${titleSlug}`,
            },
            keywords: blog.tags?.join(", ") || "",
            wordCount:
              extractTextFromHTML(blog.content)?.split(/\s+/).length || 0,
            timeRequired: `PT${
              calculateReadingTime(blog.content).replace(/[^\d]/g, "") || 1
            }M`,
          })}
        </script>
      </Head>

      <div className="container relative ">
        {/* Background Image */}
        <div className="w-full h-[400px] relative">
          <img
            src={blog?.image}
            alt={blog?.title || "Blog post image"}
            className="w-full h-full object-cover rounded-xl"
            loading="eager"
          />
          {/* Dark Overlay Card */}
          <div className="absolute -bottom-20 left-0 right-0 bg-slate-800 backdrop-blur-sm p-6 text-white w-[90%] md:w-[80%] mx-auto rounded-xl">
            {/* Tags */}
            <div className="mb-2 flex flex-wrap gap-1">
              {blog?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-teal-400 bg-[#20c99647] text-sm p-2 rounded-md mr-2"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-bold mb-4 font-sans text-2xl md:text-3xl">
              {blog?.title}
            </h1>

            <div className="flex items-center text-sm md:text-base gap-2">
              <span className="text-gray-400">•</span>
              <time dateTime={blog?.createdAt} className="text-gray-400">
                {formatDate(blog?.createdAt)}
              </time>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {calculateReadingTime(blog?.content)}
              </span>
              {blog?.author && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">By {blog.author}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="container mx-auto p-6 mt-20">
          <div className="mx-auto">
            <article
              className="min-h-[300px] p-2 rounded blog-body prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: blog?.content,
              }}
            />
          </div>

          {/* Navigation Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link
                href="/blogs"
                className="text-teal-400 hover:text-teal-600 font-medium transition-colors"
              >
                ← Back to all blogs
              </Link>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: blog.title,
                        text:
                          blog.excerpt ||
                          extractTextFromHTML(blog.content)?.substring(0, 160),
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }
                  }}
                  className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
