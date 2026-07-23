"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { customFetch } from "@/utils/customFetch";
import {
  TextareaInput,
  TextInput,
  NumberInput,
} from "@/components/admin/inputs";

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [error, setError] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear individual field error when user starts typing
    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError({
      name: "",
      phone: "",
      message: "",
    });

    setIsSubmitting(true);

    try {
      await customFetch.post("/enquiry", formData);
      // Reset form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      toast.success("Thank you for your consideration!");
    } catch (error) {
      setError(error?.response?.data);

      if (!error?.name && !error?.phone && !error?.message) {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--white)] shadow-lg p-6 rounded-2xl"
    >
      <div className="space-y-6">
        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <TextInput
              label="Name"
              name="name"
              placeholder="Your Name..."
              value={formData.name}
              onChange={handleInputChange}
              error={error?.name}
            />
          </div>

          {/* Phone Input */}
          <div>
            <NumberInput
              label="Phone"
              name="phone"
              placeholder="Phone No..."
              value={formData.phone}
              onChange={handleInputChange}
              error={error?.phone}
            />
          </div>

          {/* Email Input */}
          <div>
            <TextInput
              type="email"
              label="Email"
              name="email"
              placeholder="Your Email..."
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Message Textarea */}
          <div>
            <TextareaInput
              label="Message"
              name="message"
              placeholder="Your Message..."
              value={formData.message}
              onChange={handleInputChange}
              error={error?.message}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer
                ${
                  isSubmitting
                    ? "bg-gray-400 cursor-wait"
                    : "bg-[var(--gold-600)] hover:bg-[var(--gold-700)]"
                } 
                text-white font-semibold px-8 py-4 rounded-full text-base tracking-wide 
                transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-teal-500 focus:ring-offset-2
              `}
            >
              {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EnquiryForm;
