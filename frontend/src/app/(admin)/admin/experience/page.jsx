"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import { customFetch } from "@/utils/customFetch";
import { PaginatedAdminList, DeleteModalPopup } from "@/components";

import { Edit, Trash2, Briefcase } from "lucide-react";

export default function Experience() {
  const [deleteContext, setDeleteContext] = useState(null); // { item, refetch }

  const fetchExperiences = (debouncedSearchTerm) => {
    return async ({ pageParam = 1 }) => {
      try {
        const { data } = await customFetch(
          `/experience?page=${pageParam}&limit=6&search=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        );
        console.log({ data });
        return data;
      } catch (error) {
        console.error("Fetch experience error:", error);
        throw error;
      }
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <>
      <PaginatedAdminList
        resourceKey="experiences"
        createFetchFn={fetchExperiences}
        columns={[
          {
            key: "logo",
            label: "Logo",
            render: (item) => (
              <div className="w-10 h-10 rounded-full object-cover">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.company}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Briefcase className="w-full h-full text-gray-400" />
                )}
              </div>
            ),
          },
          {
            key: "Name",
            label: "Name",
            render: (item) => (
              <span className="font-medium text-white">{item.name || "-"}</span>
            ),
          },
          {
            key: "position",
            label: "Position",
            render: (item) => (
              <span className="font-medium text-white">
                {item.position || "-"}
              </span>
            ),
          },
          {
            key: "duration",
            label: "Duration",
            render: (item) => (
              <span className="font-medium text-white">
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </span>
            ),
          },
        ]}
        renderActions={(item, refetch) => (
          <div className="flex gap-3 items-center">
            <Link
              href={`/admin/experience/${item._id}`}
              className="cursor-pointer text-[var(--white)] transition-colors p-1 rounded-full hover:bg-[var(--primary)/10]"
              aria-label="Edit experience"
            >
              <Edit size={24} />
              <span className="sr-only">Edit</span>
            </Link>
            <button
              onClick={() => setDeleteContext({ item, refetch })}
              className="cursor-pointer text-red-600 transition-colors p-1 rounded-full hover:bg-[var(--primary)/10] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Delete experience"
            >
              <Trash2 size={24} />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        )}
        addLink="/admin/experience/add"
        searchPlaceholder="Search experience by name..."
        title="Experience"
      />

      {deleteContext && (
        <DeleteModalPopup
          deleteRoute="/experience"
          onClose={() => setDeleteContext(null)}
          itemName={
            deleteContext.item.name ||
            deleteContext.item.position ||
            "experience"
          }
          itemId={deleteContext?.item._id}
          refetch={deleteContext?.refetch}
        />
      )}
    </>
  );
}
