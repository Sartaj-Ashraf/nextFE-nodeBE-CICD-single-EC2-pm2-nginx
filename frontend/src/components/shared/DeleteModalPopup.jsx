"use client";
import { useEffect, useRef, useCallback, useState } from "react";

import {LoadingSpinner,ActionButtons} from "@/components";
import { customFetch } from "@/utils/customFetch";
import { toast } from "react-hot-toast";

import { Trash2 } from "lucide-react";

const DeleteModalPopup = ({
  onClose,
  itemName = "item",
  deleteRoute,
  itemId,
  refetch,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!itemId) return;

    try {
      setIsDeleting(true);
      await customFetch.delete(`${deleteRoute}/${itemId}`);
      toast.success(`${itemName} deleted successfully`);
      refetch();
      onClose();
    } catch (error) {
      console.error(`Failed to delete ${itemName}:`, error);
      toast.error(`Failed to delete ${itemName}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Validate required props
  if (!onClose) {
    console.error("DeleteModalPopup: onClose prop is required");
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-md mx-auto transform transition-all duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-4">
          <h2
            id="delete-modal-title"
            className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
          >
            <Trash2 className="h-5 w-5 text-red-600" aria-hidden="true" />
            Delete {itemName}
          </h2>
        </div>

        {/* Body */}
        <div className="mb-6 text-center">
          <p 
            id="delete-modal-description"
            className="text-gray-600 dark:text-gray-300"
          >
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              "{itemName}"
            </span>
            <br />
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-3">
          <ActionButtons
            submitLabel="Delete"
            isLoading={isDeleting}
            submitDisabled={isDeleting}
            onCancel={onClose}
            submitButtonType="button"
            onDelete={handleDeleteConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteModalPopup;