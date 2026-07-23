"use client";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components";

import { Save, Trash2 } from "lucide-react";

// This component handle the create, update and back navigation for admin pages
// @params cancelHref - href of the cancel button
// @params submitLabel - label of the submit button
// @params isLoading - loading state of the submit button
// @params submitDisabled - disabled state of the submit button
// @params onCancel - function to be called on cancel button click
// @params submitButtonType - type of the submit button

export default function ActionButtons({
  cancelHref,
  submitLabel = "Save",
  isLoading = false,
  submitDisabled = false,
  onCancel,
  submitButtonType = "submit",
  onDelete,
}) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
      <button
        onClick={handleCancel}
        disabled={isLoading}
        className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Cancel deletion"
        type="button"
      >
        Cancel
      </button>

      <button
        onClick={onDelete}
        type={submitButtonType}
        className={`text-white cursor-pointer px-6 py-2.5  ${onDelete ? "bg-red-600 hover:bg-red-700" : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"} rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
        disabled={isLoading || submitDisabled}
      >
        {isLoading ? (
          <>
            <LoadingSpinner height={4} width={4} bgColorName="--gray-400" />
            {onDelete ? "Deleting..." : "Saving..."}
          </>
        ) : (
          <>
            {onDelete && !isLoading ? (
              <Trash2 size={18} />
            ) : (
              <Save size={18} />
            )}
            {submitLabel}
          </>
        )}
      </button>
    </div>
  );
}
