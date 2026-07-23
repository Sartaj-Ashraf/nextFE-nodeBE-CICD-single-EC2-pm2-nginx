"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const JoditEditorComponent = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error = null,
}) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(value || "");

  useEffect(() => {
    setContent(value || "");
  }, [value]);

  const handleChange = (newContent) => {
    setContent(newContent);
    if (onChange) {
      // Create a synthetic event object similar to native onChange
      const event = {
        target: {
          name,
          value: newContent,
        },
      };
      onChange(event);
    }
  };

  const config = {
    readonly: false,
    height: 400,
    uploader: {
      insertImageAsBase64URI: true,
    },
   
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="border rounded-md text-black">
        {typeof window !== "undefined" && (
          <JoditEditor
            ref={editorRef}
            value={content}
            config={config}
            onChange={handleChange}
            // onBlur={handleChange}
            // onFocus={handleChange}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default JoditEditorComponent;
