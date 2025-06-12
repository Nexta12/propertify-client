
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const CollapsableBox = ({ title, children, link }) => {
  const [showContent, setShowContent] = useState(false);
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-gray-700 text-sm sm:text-base font-medium">
          {title}
        </h3>
        <div className="flex items-center gap-x-3">
        <Link
          to={"#"}
          onClick={() => setShowContent(!showContent)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          {showContent ? (
            <>
              <FiChevronUp className="inline" /> Hide
            </>
          ) : (
            <>
              <FiChevronDown className="inline" /> Show
            </>
          )}
        </Link>
       
         {link && (
        <Link to={link} className="flex items-center text-xs sm:text-sm text-[#28B16D] hover:text-[#09C269]">
          <FiPlus className="mr-1" /> Add New
        </Link>
          )}

        </div>
      </div>

      {showContent && <div className="overflow-x-auto">{children}</div>}
    </div>
  );
};

export default CollapsableBox;
