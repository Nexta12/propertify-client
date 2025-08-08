import React from "react";
import { PuffLoader } from "react-spinners";

const FullPageLoader = ({ className = "" }) => {
  return (
    <div className={`min-h-screen bg-[#E8F5E9] dark:bg-gray-900 flex items-center justify-center p-4 ${className}`}>
      <PuffLoader />
    </div>
  );
};

export default FullPageLoader;
