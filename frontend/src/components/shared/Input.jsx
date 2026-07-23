"use client"
import React from 'react';
import { FiUpload } from 'react-icons/fi';

export const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  className = '',
  min,
  max,
  disabled = false
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Please type here"}
        required={required}
        min={min}
        max={max}
        disabled={disabled}
        className={`text-white w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 ${className}`}
      />
    </div>
  );
};


export const Select = ({ 
    label, 
    name, 
    value, 
    onChange, 
    options, 
    placeholder = 'Select an option',
    required = false,
    className = ''
  }) => {
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
export const Textarea = ({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder, 
    required = false,
    rows = 4,
    maxLength,
    className = ''
  }) => {
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-500)] focus:border-[var(--gold-500)] resize-vertical ${className}`}
        />
        {maxLength && (
          <p className="text-sm text-gray-500 mt-1">
            {value?.length || 0}/{maxLength} characters
          </p>
        )}
      </div>
    );
  };
  
export const FileInput = ({ 
    label, 
    name, 
    onChange, 
    accept = 'image/*', 
    multiple = false,
    required = false,
    className = ''
  }) => {
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-white mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type="file"
            id={name}
            name={name}
            onChange={onChange}
            accept={accept}
            multiple={multiple}
            required={required}
            className="sr-only"
          />
          <label
            htmlFor={name}
            className={`text-white flex items-center justify-center w-full px-4 py-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${className}`}
          >
            <div className="text-center">
              <FiUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload {multiple ? 'images' : 'image'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </label>
        </div>
      </div>
    );
  };

  export const Button = ({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    size = 'md',
    onClick, 
    disabled = false,
    className = '',
    ...props
  }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  // export const LoadingSpinner = ({ size = 'md' }) => {
  //   const sizes = {
  //     sm: 'w-4 h-4',
  //     md: 'w-8 h-8',
  //     lg: 'w-12 h-12'
  //   };
  
  //   return (
  //     <div className="flex justify-center items-center">
  //       <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}></div>
  //     </div>
  //   );
  // };
  
