"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import { customFetch } from "@/utils/customFetch";
import { PaginatedAdminList, DeleteModalPopup } from "@/components";

import { Edit, Trash2 } from "lucide-react";

export default function TechStack() {
  const [deleteContext, setDeleteContext] = useState(null);

  const fetchTechStacks = (debouncedSearchTerm) => {
    return async ({ pageParam = 1 }) => {
      try {
        const { data } = await customFetch(
          `/techStack?page=${pageParam}&limit=6&search=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        );
        console.log({ data });
        return data;
      } catch (error) {
        console.error("Fetch techStack error:", error);
        throw error;
      }
    };
  };
  return (
    <>
      <PaginatedAdminList
        resourceKey="techStacks"
        createFetchFn={fetchTechStacks}
        columns={[
          {
            key: "image",
            label: "Image",
            render: (item) => (
              <div className="w-10 h-10 rounded-full object-cover">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Briefcase className="w-full h-full text-gray-400" />
                )}
              </div>
            ),
          },
          {
            key: "name",
            label: "Name",
            render: (item) => (
              <span className="font-medium text-white">
                {item.name || "-"}
              </span>
            ),
          },
          {
            key: "description",
            label: "Description",
            render: (item) => (
              <span className="font-medium text-white">
                {item.description || "-"}
              </span>
            ),
          },
        ]}
        renderActions={(item, refetch) => (
          <div className="flex gap-3 items-center">
            <Link
              href={`/admin/techstack/update/${item._id}`}
              className="cursor-pointer text-[var(--white)] transition-colors p-1 rounded-full hover:bg-[var(--primary)/10]"
              aria-label="Edit techStack"
            >
              <Edit size={24} />
              <span className="sr-only">Edit</span>
            </Link>
            <button
              onClick={() => setDeleteContext({ item, refetch })}
              className="cursor-pointer text-red-600 transition-colors p-1 rounded-full hover:bg-[var(--primary)/10]"
              aria-label="Delete techStack"
            >
              <Trash2 size={24} />
              <span className="sr-only">Delete</span>
            </button>
          </div>

        )}
        addLink="/admin/techstack/add"
        searchPlaceholder="Search techStack by name..."
        title="TechStack"
      />
      {deleteContext && (
        <DeleteModalPopup
          deleteRoute="/techStack"
          onClose={() => setDeleteContext(null)}
          itemName={deleteContext?.item?.name || "techStack"}
          itemId={deleteContext?.item?._id}
          refetch={deleteContext?.refetch}
        />
      )}
    </>
  );
}
