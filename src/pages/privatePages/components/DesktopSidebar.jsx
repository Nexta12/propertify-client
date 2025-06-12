import React from "react";
import SidebarNav from "./SidebarNav";

const DesktopSidebar = () => {
  return (
    <div className="hidden md:block w-64 bg-white shadow-md">
      <SidebarNav />
    </div>
  );
};

export default DesktopSidebar;
