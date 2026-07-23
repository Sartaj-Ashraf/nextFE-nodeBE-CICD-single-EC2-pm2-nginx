import React from "react";

// Skeleton Animation Component
const SkeletonPulse = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Individual skeleton row component
const SkeletonTableRow = ({ columns }) => (
  <tr className="border-b border-gray-100">
    {columns.map((_, index) => (
      <td key={index} className="px-6 py-4">
        <SkeletonPulse className="h-4 w-full max-w-[120px]" />
      </td>
    ))}
    {/* Actions column */}
    <td className="px-6 py-4">
      <div className="flex gap-2">
        <SkeletonPulse className="h-8 w-8 rounded-lg" />
        <SkeletonPulse className="h-8 w-8 rounded-lg" />
      </div>
    </td>
  </tr>
);

// Main Skeleton Component
export default function PaginatedAdminListSkeleton({
  title = "Loading...",
  columns = [],
  showAddButton = true,
  rowCount = 6,
}) {
  // Generate default columns if none provided
  const skeletonColumns =
    columns.length > 0
      ? columns
      : [
          { key: "col1", label: "Column 1" },
          { key: "col2", label: "Column 2" },
          { key: "col3", label: "Column 3" },
          { key: "col4", label: "Column 4" },
          { key: "col5", label: "Column 5" },
        ];

  return (
    <div className="space-y-2">
      {/* Header Section Skeleton */}
      <div className="flex justify-between items-center border-b pb-6">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="h-9 w-48" />
        </div>
        {showAddButton && <SkeletonPulse className="h-11 w-32 rounded-lg" />}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Search and Controls Skeleton */}
        <div className="flex justify-between gap-3 mb-8">
          <div className="flex-1">
            <SkeletonPulse className="h-10 w-full max-w-md rounded-lg" />
          </div>
          <div className="flex gap-2">
            <SkeletonPulse className="h-10 w-24 rounded-lg" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200" role="grid">
            {/* Table Header Skeleton */}
            <thead className="bg-gray-50">
              <tr>
                {skeletonColumns.map((col, index) => (
                  <th
                    key={col.key || index}
                    className="px-6 py-4 text-left"
                    scope="col"
                  >
                    <SkeletonPulse className="h-3 w-20" />
                  </th>
                ))}
                <th className="px-6 py-4 text-left" scope="col">
                  <SkeletonPulse className="h-3 w-16" />
                </th>
              </tr>
            </thead>

            {/* Table Body Skeleton */}
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: rowCount }, (_, index) => (
                <SkeletonTableRow key={index} columns={skeletonColumns} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading Indicator Skeleton */}
        <div className="flex justify-center mt-12 py-4">
          <div className="flex items-center gap-2">
            <SkeletonPulse className="h-6 w-6 rounded-full" />
            <SkeletonPulse className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Skeleton with more realistic data patterns
export function PaginatedAdminListSkeletonEnhanced({
  title = "Loading...",
  columns = [],
  showAddButton = true,
  rowCount = 6,
  resourceKey = "items",
}) {
  const skeletonColumns =
    columns.length > 0
      ? columns
      : [
          { key: "name", label: "Name", width: "w-32" },
          { key: "email", label: "Email", width: "w-40" },
          { key: "phone", label: "Phone", width: "w-28" },
          { key: "message", label: "Message", width: "w-48" },
          { key: "date", label: "Date", width: "w-24" },
        ];

  return (
    <div className="space-y-2">
      {/* Table Container Skeleton */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" role="grid">
            {/* Enhanced Table Header */}
            <thead className="bg-gray-50/50">
              <tr>
                {skeletonColumns.map((col, index) => (
                  <th
                    key={col.key || index}
                    className="px-6 py-4 text-left"
                    scope="col"
                  >
                    <SkeletonPulse className={`h-3 ${col.width || "w-20"}`} />
                  </th>
                ))}
                <th className="px-6 py-4 text-left" scope="col">
                  <SkeletonPulse className="h-3 w-16" />
                </th>
              </tr>
            </thead>

            {/* Enhanced Table Body with varied skeleton sizes */}
            <tbody className="bg-white divide-y divide-gray-100">
              {Array.from({ length: rowCount }, (_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {skeletonColumns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <div className="flex items-center">
                        {/* Vary skeleton widths for more realistic look */}
                        <SkeletonPulse
                          className={`h-4 ${
                            colIndex === 0
                              ? "w-24" // Name
                              : colIndex === 1
                              ? "w-36" // Email
                              : colIndex === 2
                              ? "w-20" // Phone
                              : colIndex === 3
                              ? "w-40" // Message
                              : "w-16" // Date
                          }`}
                        />
                      </div>
                    </td>
                  ))}
                  {/* Actions column with button skeletons */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <SkeletonPulse className="h-8 w-8 rounded-lg" />
                      <SkeletonPulse className="h-8 w-8 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loading More Indicator */}
      <div className="text-center pt-8">
        <div className="flex flex-col items-center gap-3">
          <SkeletonPulse className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
