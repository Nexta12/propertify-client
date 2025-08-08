import React from "react";
import { FaLightbulb, FaSearchLocation } from "react-icons/fa";

export const PopularTags = () => {
  const tags = [
    "Builder",
    "Photographer",
    "Fashion Designer",
    "Mechanic",
    "Plumber",
    "Electrician",
    "Caterer",
    "Hair Stylist",
  ];

  return (
    <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
      <h3 className="font-semibold text-primary-text mb-3 text-sm flex items-center gap-1">
        <FaSearchLocation className="text-orange" /> Popular Professions
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            className="text-xs bg-bg-green text-primary-text px-3 py-1 rounded-full hover:bg-green-hover transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export const MiniTips = () => {
  const tips = [
    "Use specific names to narrow results.",
    "Filter by state if you know the location.",
    // "Combine profession and location for best results.",
    // "Check profiles for verified badges.",
  ];

  return (
    <div className="bg-white border rounded-md p-4 shadow-sm mb-6">
      <h3 className="font-semibold text-primary-text mb-3 text-sm flex items-center gap-1">
        <FaLightbulb className="text-orange" /> Search Tips
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-sm text-secondary">
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};
