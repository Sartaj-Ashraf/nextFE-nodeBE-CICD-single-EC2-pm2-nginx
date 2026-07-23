import { FileText, Upload } from "lucide-react";
import Image from "next/image";
import React from "react";

const SingleFileUpload = ({
  label,
  backgroundPreview,
  name,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        {backgroundPreview ? (
          <div className="mb-4 relative w-full h-48">
            <Image
              src={backgroundPreview}
              alt="Background Preview"
              fill
              className="object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="mb-4 w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
            <FileText size={32} className="text-gray-400" />
          </div>
        )}
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-medium text-gray-700 mb-1">
            {backgroundPreview ? "Replace image" : "Upload background image"}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            SVG, PNG, JPG or GIF (max. 5MB)
          </p>
          <input
            type="file"
            name={name}
            onChange={onChange}
            className="border border-gray-200 rounded-lg overflow-hidden block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};

export default SingleFileUpload;
