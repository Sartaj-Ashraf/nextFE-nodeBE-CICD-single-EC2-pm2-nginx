"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

const FileInput = ({
  label,
  name,
  onChange,
  accept = "image/*",
  required = false,
  error = null,
  previewUrl = null,
}) => {
  const [preview, setPreview] = useState(previewUrl);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    if (onChange) {
      onChange(e);
    }
  };

  const handleRemoveFile = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Create a synthetic event to clear the file
    if (onChange) {
      const event = {
        target: {
          name,
          value: "",
          files: [],
        },
      };
      onChange(event);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1 text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center gap-2">
        <label className="text-gray-300   cursor-pointer flex items-center gap-2 px-4 py-2  hover:bg-gray-700 rounded-md transition-colors">
          <Upload size={18} />
          <span>Choose File</span>
          <input
            ref={fileInputRef}
            type="file"
            name={name}
            onChange={handleFileChange}
            accept={accept}
            required={required && !preview}
            className="hidden"
          />
        </label>

        {preview && (
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-2 bg-red-100 hover:bg-red-200 rounded-md text-red-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {preview && (
        <div className="mt-2">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="max-h-40 rounded-md border border-gray-300"
          />
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileInput;
