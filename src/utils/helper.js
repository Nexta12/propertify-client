import { paths } from "@routes/paths";
import { UserRole } from "./constant";
import { professions } from "./data";
import { useEffect } from "react";

export const getLoggedInUserPath = (user) => {
  const rolePathMap = {
    [UserRole.ADMIN]: paths.adminDashboard,
    [UserRole.REALTOR]: paths.agentDashboard,
    [UserRole.ENGINEER]: paths.othersDashboard,
    [UserRole.SERVICE]: paths.othersDashboard,
    [UserRole.TRADER]: paths.othersDashboard,
  };

  return rolePathMap[user.role] || paths.index;
};

export const getRoleFromProfession = (professionValue) => {
  const profession = professions.find((p) => p.value === professionValue);
  return profession?.role || "user"; // default to 'general' if no role specified
};

export const formatLargeNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) return '';

  const absNum = Math.abs(number);

  if (absNum >= 1_000_000_000_000) {
    return (number / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
  } else if (absNum >= 1_000_000_000) {
    return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (absNum >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }

  // Return number with comma formatting if less than 1 million
  return number.toLocaleString();
}


export const handleFileUploadWith = (name, files, setFormData) => {
  setFormData((prev) => {
    // Combine existing images with new files
    const combinedImages = [
      ...prev.otherImages, // Keep existing images
      ...files.filter(file => !prev.otherImages.includes(file)) // Add new files that aren't already present
    ];

    return {
      ...prev,
      [name]: combinedImages,
    };
  });
};

 
  export const handleGoBack = (navigate, user) => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(getLoggedInUserPath(user));
    }
  };

  export const useTenMinuteTimeout = (callback) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, 600000); // 10 minutes in milliseconds (10 * 60 * 1000)

    // Cleanup function to clear timeout if component unmounts
    return () => clearTimeout(timer);
  }, [callback]); 
};

export const formatTitleCase = (str) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}