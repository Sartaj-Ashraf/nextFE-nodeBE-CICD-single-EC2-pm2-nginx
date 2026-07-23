// FeaturedBlogsSkeleton.jsx
export default function FeaturedBlogsSkeleton({ count = 3 }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex gap-4 items-center animate-pulse">
          {/* Image Skeleton */}
          <div className="w-32 h-24 bg-gray-700 rounded-lg" />

          {/* Text Block Skeleton */}
          <div className="flex-1 space-y-3">
            {/* Title Skeleton */}
            <div className="h-5 bg-gray-600 rounded w-3/4" />

            {/* Meta Row */}
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-600 rounded" />
              <div className="h-4 w-20 bg-gray-600 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
