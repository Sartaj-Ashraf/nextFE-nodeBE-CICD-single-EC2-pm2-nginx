// AllLatestblogsCardSkeleton.jsx
export default function AllLatestblogsCardSkeleton() {
    return (
      <div className="relative p-3 bg-[var(--bs-card-bg)] rounded-lg shadow-lg animate-pulse h-[100%] flex flex-col justify-between overflow-hidden">
        {/* Image Skeleton */}
        <div className="w-full h-64 bg-gray-700 rounded-lg" />
  
        {/* Tag Skeleton */}
        <div className="absolute top-4 left-4">
          <div className="h-5 w-24 bg-gray-600 rounded-full" />
        </div>
  
        {/* Title + Metadata */}
        <div className="mt-4 space-y-3">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-600 rounded w-3/4" />
          <div className="h-4 bg-gray-600 rounded w-1/2" />
  
          {/* Link Skeleton */}
          <div className="flex justify-between items-center mt-3">
            <div className="h-4 w-24 bg-gray-600 rounded" />
            <div className="h-4 w-16 bg-gray-600 rounded" />
          </div>
        </div>
      </div>
    );
  }
  