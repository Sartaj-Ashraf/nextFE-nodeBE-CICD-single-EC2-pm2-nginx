"use client";

const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  error = null,
}) => {
  return (
    <div className="">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-white mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`text-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextInput;
