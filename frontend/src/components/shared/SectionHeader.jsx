"use client";

export default function SectionHeader({ heading, subHeading, title }) {
  return (
    <header className="text-center mb-16 text-white">
      <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full mb-4">
        {title}
      </span>
      <h2 className="text-4xl font-bold tracking-tight mb-4">
        {heading}
      </h2>
      <p className="text-lg max-w-2xl mx-auto text-gray-400">
        {subHeading}
      </p>
    </header>
  );
}
