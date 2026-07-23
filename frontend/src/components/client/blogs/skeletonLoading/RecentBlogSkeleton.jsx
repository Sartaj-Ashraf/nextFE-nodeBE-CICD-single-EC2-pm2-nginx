export default function RecentBlogSkeleton() {
  return (
    <div className="rounded-[10px] overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-64 bg-gray-700" />

      {/* Content Skeleton */}
      <div className="py-6 space-y-4">
        {/* Date skeleton */}
        <div className="flex items-center text-sm gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded" />
          <div className="h-4 w-28 bg-gray-600 rounded" />
        </div>

        {/* Title skeleton */}
        <div className="h-5 w-3/4 bg-gray-600 rounded" />
        <div className="h-5 w-2/3 bg-gray-600 rounded" />

        {/* Read more link skeleton */}
        <div className="h-4 w-24 bg-gray-600 rounded mt-4" />
      </div>
    </div>
  );
}
