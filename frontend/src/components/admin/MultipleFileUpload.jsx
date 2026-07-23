"use client";
import React from "react";
import Image from "next/image";
import { FileInput } from "../shared/Input";

const MultipleFileUpload = ({
  label,
  name,
  handleBackgroundsChange,
  backgroundPreviews,
  removeBackground,
  isUpdate = false,
}) => {
  console.log(backgroundPreviews);
  return (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      <div className="mb-4">
        <FileInput
          label={label}
          name={name}
          onChange={handleBackgroundsChange}
          multiple
          accept="image/*"
        />
        <p className="text-sm text-gray-500 mt-1">
          Maximum file size: 5MB per image.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Max images per carousel: 10
        </p>
      </div>

      {/* Background Previews */}
      {backgroundPreviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
          {backgroundPreviews.map((preview, index) => (
            <div key={index} className="relative">
              <div className="relative h-40 rounded overflow-hidden">
                <Image
                  src={
                    isUpdate
                      ? URL.createObjectURL(preview)
                      : URL.createObjectURL(preview)
                  }
                  alt={`Background Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeBackground(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                aria-label="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleFileUpload;
