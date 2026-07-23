"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Search} from "lucide-react";

import {
  AllLatestblogsCard,
  AllLatestblogsCardSkeleton,
  FeaturedBlogs,
  FeaturedBlogsSkeleton,
  FilterAndSearch,
  RecentBlog,
  RecentBlogSkeleton,
} from "@/components";

import {customFetch} from "@/utils/customFetch";


// Main Blog Page Component
const BlogGrid = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search_term: '',
    start_date: '',
    end_date: '',
    sort_by: 'newest'
  });

  // Debounced search to avoid too many API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchData = useCallback(async (filterParams = {}) => {
    try {
      setIsLoading(true);
      
      // Build query string
      const queryParams = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/blogs?${queryString}` : '/blogs';
      
      const { data } = await customFetch.get(url);
      setBlogs(data?.blogs || []);
      console.log({data});
      
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when debounced filters change
  useEffect(() => {
    fetchData(debouncedFilters);
  }, [debouncedFilters, fetchData]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      search_term: '',
      start_date: '',
      end_date: '',
      sort_by: 'newest'
    };
    setFilters(clearedFilters);
  }, []);

  const recentBlog = useMemo(() => blogs?.slice(-1)[0], [blogs]);
  const filteredBlogs = useMemo(() => 
    blogs?.filter((blog) => blog._id !== recentBlog?._id) || [], 
    [blogs, recentBlog]
  );

  if (isLoading && blogs.length === 0) {
    return (
      <section className="min-h-screen py-12 container">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-1">
              <RecentBlogSkeleton />
            </div>
            <div className="md:col-span-1">
              <FeaturedBlogsSkeleton />
            </div>
          </div>
        </div>
        <div className="py-12">
          <div className="animate-pulse text-center">
            <h1 className="text-4xl font-sans font-bold text-center mb-2 bg-gray-600 rounded h-8 w-64 mx-auto" />
            <h3 className="bg-gray-600 rounded h-16 w-3/4 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <AllLatestblogsCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-12 flex-1 bg-slate-900 relative">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 container text-white">
          <div className="md:col-span-1">
            <RecentBlog recentBlog={recentBlog} />
          </div>
          <div className="md:col-span-1">
            <FeaturedBlogs />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/20 backdrop-blur-xs text-white py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-sans font-bold text-center mb-2">
              Oasisascend Blogs
            </h1>
            <h3 className="text-gray-400">
              Discover the latest news and insights from our blog posts. Our
              blogs cover a wide range of topics, from industry trends and best
              practices to tips and tricks for getting the most out of our
              services.
            </h3>
          </div>

          {/* Advanced Filters */}
          <FilterAndSearch
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            totalResults={blogs.length}
            isLoading={isLoading}
          />

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, index) => (
                <div key={index}>
                  <AllLatestblogsCard blog={blog} />
                </div>
              ))
            ) : !isLoading && blogs.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
                  <p>Try adjusting your search criteria or clear the filters to see all blogs.</p>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;