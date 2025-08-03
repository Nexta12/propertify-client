import { paths } from "@routes/paths";
import { UserRole } from "./constant";
import { professions } from "./data";
import { useEffect } from "react";

export const getLoggedInUserPath = (user) => {

  const rolePathMap = {
    [UserRole.ADMIN]: paths.dashboard,
    [UserRole.REALTOR]: paths.feed,
    [UserRole.ENGINEER]: paths.feed,
    [UserRole.SERVICE]: paths.feed,
    [UserRole.TRADER]: paths.feed,
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
    if (typeof str !== 'string' || !str.trim()) return '';

  return str
    // .split('_')
    .split(/[-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
   
}

export  const MessageEncoder = (message) =>{
 return message ? encodeURIComponent(message.trim()) : "";

} 

  export const DateFormatter = (dateString, showTime = false) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return '-'; // Return '-' for invalid or null dates
    }
  
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][
      (day % 10 > 3 || [11, 12, 13].includes(day % 100)) ? 0 : day % 10
    ];
  
    // Format the date (e.g., "Wed, Apr 3rd, 2024")
    const formattedDate = date.toLocaleDateString("en-US", { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).replace(/\d+/, `${day}${suffix}`);
  
    // Return only the date if `showTime` is false
    if (!showTime) return formattedDate;
  
    // Format the time (e.g., "12:30 PM")
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  
    return `${formattedDate} at ${formattedTime}`;
  };

  export const formatPercentageChange = (percent) => {
  const sign = percent > 0 ? "+" : percent < 0 ? "" : "";
  return `${sign}${percent}% from last month`;
};


