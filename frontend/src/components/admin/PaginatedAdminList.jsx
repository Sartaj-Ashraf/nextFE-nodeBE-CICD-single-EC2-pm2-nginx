"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import toast from "react-hot-toast";

import { useDebouncedSearchHook } from "@/hooks/useDebouncedSearchHook";
import { LoadingSpinner, NoMoreContentToLoad, SearchInput } from "@/components";
import { PaginatedAdminListSkeletonEnhanced } from "./PaginatedAdminListSkeleton";


import { AlertCircle, Plus, RefreshCw } from "lucide-react";

export default function PaginatedAdminList({
  resourceKey,
  fetchFn,
  createFetchFn,
  columns,
  renderActions,
  addLink,
  searchPlaceholder,
  title,
}) {
  const { searchTerm, debouncedSearchTerm, handleSearchChange } =
    useDebouncedSearchHook("", 700);
  const { ref, inView } = useInView();

  const actualFetchFn = fetchFn || createFetchFn(debouncedSearchTerm);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [resourceKey, debouncedSearchTerm],
    queryFn: actualFetchFn,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.numOfPages
        ? lastPage.currentPage + 1
        : undefined,
    initialPageParam: 1,
    keepPreviousData: true,
  });

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten data from all pages
  const items = data?.pages?.flatMap((page) => page[resourceKey] || []) || [];
  console.log({ items });
  // Debug logging
  useEffect(() => {
    if (isError) {
      console.error(`Error loading ${resourceKey}:`, error);
    }
  }, [isError, error, resourceKey]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-serif text-white">{title}</h1>
        {addLink && (
          <Link
            href={addLink}
            className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            aria-label={`Add new ${resourceKey}`}
          >
            <Plus size={18} />
            <span className="font-medium">Add {title}</span>
          </Link>
        )}

      </div>

      <div className="rounded-xl shadow-sm border border-gray-100 p-6">
        <form
          className="flex justify-between gap-3 mb-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <SearchInput
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            placeholder={searchPlaceholder}
            aria-label={`Search ${resourceKey}`}
          />
          <div className="group relative">
            <button
              onClick={async () => {
                await refetch();
                toast.success(`Refreshed ${resourceKey}`);
              }}
              disabled={isLoading || isFetchingNextPage}
              className="cursor-pointer flex items-center gap-2 justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
              aria-label={`Refresh ${resourceKey}`}
            >
              {isLoading || isFetchingNextPage ? (
                <LoadingSpinner width={4} height={4} />
              ) : (
                <RefreshCw className="h-4 w-4 group-hover:text-[var(--gold-600)]" />
              )}
              <span className="text-xs">Refresh</span>
            </button>
            <div className="absolute -top-12 right-0 px-2 py-1 bg-gray-800 rounded-md hidden group-hover:block">
              <span className="text-white text-xs">Refresh</span>
            </div>
          </div>
        </form>

        {isLoading && !data ? (
          <div >
            <PaginatedAdminListSkeletonEnhanced resourceKey={resourceKey} columns={columns}/>
          </div>
        ) : isError ? (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3"
            role="alert"
          >
            <AlertCircle size={20} />
            <div className="flex-1">
              <span>Failed to load {resourceKey}. Please try again.</span>
              {error?.message && (
                <div className="text-sm text-red-600 mt-1">
                  Error: {error.message}
                </div>
              )}
            </div>
            <button
              onClick={async () => {
                await refetch();
                toast.success(`Refreshed ${resourceKey}`);
              }}
              className="ml-4 text-sm text-red-600 hover:underline"
              aria-label={`Retry loading ${resourceKey}`}
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">No {resourceKey} found</p>
            <p className="text-sm text-gray-400">
              Try a different search or add a new {resourceKey.slice(0, -1)}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table
                className="min-w-full divide-y divide-gray-200"
                role="grid"
              >
                <thead className="bg-gray-800">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        scope="col"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                      scope="col"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-800 transition-colors"
                      role="row"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-6 py-4 whitespace-nowrap text-white max-w-[200px] overflow-hidden text-ellipsis"
                        >
                          {col.render(item)}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderActions(item, refetch)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div ref={ref} className="flex justify-center mt-12 py-4">
              {isFetchingNextPage && <LoadingSpinner />}
            </div>
            {!hasNextPage && items.length > 0 && (
              <NoMoreContentToLoad
                textToDisplay={`No more ${resourceKey} to load`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
