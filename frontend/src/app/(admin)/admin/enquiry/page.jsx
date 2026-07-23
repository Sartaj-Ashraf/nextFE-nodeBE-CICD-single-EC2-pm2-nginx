"use client";
import { useState } from "react";
import toast from "react-hot-toast";

import { customFetch } from "@/utils/customFetch";
import {
  LoadingSpinner,
  PaginatedAdminList,
  ReadFullEnqueryModal,
  DeleteModalPopup,
} from "@/components";

import { Eye, Trash2 } from "lucide-react";

export default function Enquiry() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteContext, setDeleteContext] = useState(null);

  const fetchEnquiry = (debouncedSearchTerm) => {
    return async ({ pageParam = 1 }) => {
      try {
        const { data } = await customFetch(
          `/enquiry?page=${pageParam}&limit=6&search=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        );
        console.log({ data });
        return data;
      } catch (error) {
        console.error("Fetch enquiry error:", error);
        throw error;
      }
    };
  };

  return (
    <div>
      <PaginatedAdminList
        resourceKey="enquiry"
        createFetchFn={fetchEnquiry}
        columns={[
          {
            key: "name",
            label: "Name",
            render: (item) => (
              <span className="font-medium text-white">{item.name || "-"}</span>
            ),
          },
          {
            key: "phone",
            label: "Phone",
            render: (item) => (
              <span className="font-medium text-white">
                {item.phone || "-"}
              </span>
            ),
          },
          {
            key: "email",
            label: "Email",
            render: (item) => (
              <span className="font-medium text-white">
                {item.email || "-"}
              </span>
            ),
          },
        ]}
        renderActions={(item, refetch) => (
          <div className="flex gap-3 items-center ">
            <div className="relative group ">
              <button
                onClick={() => {
                  setSelectedContact(item);
                  setIsModalOpen(true);
                }}
                className="cursor-pointer text-[var(--white)] transition-colors p-1 rounded-full hover:bg-[var(--primary)/10]"
                aria-label="Delete project"
              >
                <Eye size={24} />
                <span className="sr-only">View</span>
              </button>
              <div className="z-50 absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap shadow-lg">
                View details
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setDeleteContext({ item, refetch })}
                className="cursor-pointer text-red-600 hover:text-red-800 transition-colors p-1 rounded-full "
                aria-label="Delete project"
              >
                <Trash2 size={18} />
                <span className="sr-only">Delete</span>
              </button>
              <div className="z-50 absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap shadow-lg">
                Delete Contact Query
              </div>
            </div>
          </div>
        )}
        searchPlaceholder="Search enquiry by name..."
        title="Enquiry"
      />
      {deleteContext && (
        <DeleteModalPopup
          deleteRoute="/enquiry"
          onClose={() => setDeleteContext(null)}
          itemName={deleteContext?.item?.name || "enquiry"}
          itemId={deleteContext?.item?._id}
          refetch={deleteContext?.refetch}
        />
      )}
      {isModalOpen && (
        <ReadFullEnqueryModal
          onClose={() => setIsModalOpen(false)}
          name={selectedContact?.name}
          message={selectedContact?.message}
        />
      )}
    </div>
  );
}
