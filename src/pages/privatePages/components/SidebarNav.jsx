// import React from "react";
// import { useMenuStore } from "@store/MenuStore";
// import { DashBoardMenuItems } from "@utils/data";
// import { Link, useNavigate } from "react-router-dom";
// import { paths } from "@routes/paths";
// import { FiX } from "react-icons/fi";
// import useAuthStore from "@store/authStore";

// const SidebarNav = () => {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();

//   const { activeTab, setActiveTab, mobileMenuOpen, toggleMobileMenu } =
//     useMenuStore();

//   const setTabAndCloseSidebar = (item) => {
//     setActiveTab(item.title.toLowerCase());
//     toggleMobileMenu();
//   };

//   const handleLogout = async () => {
//     setActiveTab("dashboard") // reset active tab to dashboard for next login
//     await logout(navigate);
//   };

//   return (
//     <>
//       <div className=" p-4 flex items-start gap-3">
//         <button
//           onClick={toggleMobileMenu}
//           className="mt-1 text-gray-900 md:hidden"
//         >
//           {mobileMenuOpen && <FiX size={24} />}
//         </button>
//         <Link to={paths.index}>
//           <div className=" border-b border-gray-200">
//             <div className="text-2xl font-bold text-[#28B16D]">Propertify</div>
//             <div className="text-xs text-gray-500">
//               Premium Real Estate Dashboard
//             </div>
//           </div>
//         </Link>
//       </div>

//       <nav className="p-4 overflow-y-auto h-[calc(100%-80px)]">
//         {/* Mobile menu items same as desktop but with selectTab */}
//         {DashBoardMenuItems.map((item, i) => {
//           if (item.title === "Logout" && item.visibility.includes(user?.role)) {
//             return (
//               <button
//                 key={i}
//                 className="flex items-center w-full p-3 rounded-lg mb-2"
//                 onClick={handleLogout}
//               >
//                 {/* Dynamically render the icon component */}
//                 <item.icon className="mr-3" />
//                 {item.title}
//               </button>
//             );
//           }
//           if (item.visibility.includes(user?.role)) {
//             return (
//               <Link
//                 key={i}
//                 to={item.link}
//                 onClick={() => setTabAndCloseSidebar(item)}
//                 className={`flex items-center w-full p-3 rounded-lg mb-2 ${
//                   activeTab === item.title.toLowerCase()
//                     ? "bg-[#E8F5E9] text-[#28B16D]"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {/* Dynamically render the icon component */}
//                 <item.icon className="mr-3" />
//                 {item.title}
//               </Link>
//             );
//           }
//           return null; // Add this to handle cases where the condition isn't met
//         })}
//       </nav>
//     </>
//   );
// };

// export default SidebarNav;

import React, { useEffect, useState } from "react";
import { useMenuStore } from "@store/MenuStore";
import { DashBoardMenuItems } from "@utils/data";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@routes/paths";
import { FiX, FiChevronDown } from "react-icons/fi";
import useAuthStore from "@store/authStore";
import { AnimatePresence, motion as Motion } from "framer-motion";

const SidebarNav = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { activeTab, setActiveTab, mobileMenuOpen, toggleMobileMenu } =
    useMenuStore();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (title) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const setTabAndCloseSidebar = (item) => {
    setActiveTab(item.title.toLowerCase());
    toggleMobileMenu();
  };

  const handleLogout = async () => {
    setActiveTab("dashboard");
    await logout(navigate);
  };

 // Add this useEffect to auto-expand parent menus
useEffect(() => {
  const parentMenu = DashBoardMenuItems.find((item) =>
    item.submenu?.some((subItem) => 
      subItem.title.toLowerCase() === activeTab
    )
  );
  if (parentMenu) setExpandedMenus({ [parentMenu.title]: true });
}, [activeTab]);

  return (
    <>
      <div className="p-4 flex items-start gap-3">
        <button
          onClick={toggleMobileMenu}
          className="mt-1 text-gray-900 md:hidden"
        >
          {mobileMenuOpen && <FiX size={24} />}
        </button>
        <Link to={paths.index}>
          <div className="border-b border-gray-200">
            <div className="text-2xl font-bold text-[#28B16D]">Propertify</div>
            <div className="text-xs text-gray-500">
              Premium Real Estate Dashboard
            </div>
          </div>
        </Link>
      </div>

      <nav className="p-4 overflow-y-auto h-[calc(100%-80px)]">
        {DashBoardMenuItems.map((item, i) => {
          if (item.title === "Logout" && item.visibility.includes(user?.role)) {
            return (
              <button
                key={i}
                className="flex items-center w-full p-3 rounded-lg mb-2"
                onClick={handleLogout}
              >
                <item.icon className="mr-3" />
                {item.title}
              </button>
            );
          }

          if (item.visibility.includes(user?.role)) {
            return (
              <div key={i}>
                {/* Parent Menu Item */}
                <Link
                 to={item.link}
                  onClick={() =>
                    item.submenu
                      ? toggleSubmenu(item.title)
                      : setTabAndCloseSidebar(item)
                  }
                  className={`flex items-center justify-between w-full p-3 rounded-lg mb-1 cursor-pointer ${
                    activeTab === item.title.toLowerCase()
                      ? "bg-[#E8F5E9] text-[#28B16D]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3" />
                    {item.title}
                  </div>
                  {item.submenu && (
                    <FiChevronDown
                      className={`transition-transform ${
                        expandedMenus[item.title] ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Submenu Items */}
                <AnimatePresence>
                  {item.submenu && expandedMenus[item.title] && (
                    <Motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 pl-2 border-l-2 border-gray-200"
                    >
                      <div >
                          {item.submenu.map((subItem, j) => (
                            <Link
                              key={j}
                              to={subItem.link}
                              onClick={() => setTabAndCloseSidebar(subItem)}
                              className={`flex items-center w-full p-2 rounded-lg mb-1 text-sm ${
                                activeTab === subItem.title.toLowerCase()
                                  ? "bg-[#E8F5E9] text-[#28B16D]"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }
          return null;
        })}
      </nav>
    </>
  );
};

export default SidebarNav;
