
import React, { useEffect, useState } from "react";
import { DashBoardMenuItems } from "@utils/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "@store/authStore";
import { BsChevronDown } from "react-icons/bs";
import { AnimatePresence, motion as Motion } from "framer-motion";

const SidebarNav = ({ handleSidepanel }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <nav className="p-4 bg-white dark:bg-gray-900 overflow-y-auto h-full">
      {DashBoardMenuItems.map((item, i) => {
        if (!item.visibility.includes(user?.role)) return null;

        let resolvedItem = { ...item };

        // If this is the Account link, append the user slug
        if (item.title === "Profile" && user?.slug) {
          resolvedItem.link = `${item.link.replace(":slug", "")}${user.slug}`;
        }

        if (item.title === "Logout") {
          return (
            <SideBarLink
              key={i}
              item={resolvedItem}
              pathname={pathname}
              onClick={handleLogout}
            />
          );
        }

        return (
          <SideBarLink
            key={i}
            item={resolvedItem}
            pathname={pathname}
            onClick={handleSidepanel}
          />
        );
      })}
    </nav>
  );
};

function SubMenu({ item, pathname, onClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;
  const { user } = useAuthStore()

    const visibleSubItems = item.subItems.filter(
    (subItem) =>
      !subItem.visibility || subItem.visibility.includes(user?.role)
  );

  const isActive = visibleSubItems?.some(
    (subItem) => pathname === subItem.link || pathname.includes(subItem.link)
  );


  useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive, pathname]);

  return (
    <div className="mb-2">
      <div
        className={`flex items-center px-3 gap-x-3 rounded-sm py-2 group hover:bg-green-500/25 transition-all duration-300 ease-in-out cursor-pointer ${
          isActive ? "bg-green-500/15 text-main-green " : "hover:bg-green-500/15"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl">
          <Icon className="text-main-green" />
        </span>
        <div className="flex items-center justify-between flex-1">
          <span>{item.title}</span>
          <span
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <BsChevronDown />
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-8 mt-1 overflow-hidden"
          >
            {visibleSubItems.map((subItem, index) => {
              const isSubActive =
                pathname === subItem.link || pathname.includes(subItem.link);
              return (
                <Link
                  key={index}
                  to={subItem.link}
                  onClick={onClick}
                  className={`block px-3 py-2 mb-1 rounded-sm transition-colors duration-200 ${
                    isSubActive
                      ? "bg-green-hover/65 text-white"
                      : "hover:bg-green-700/20"
                  }`}
                >
                  {subItem.title}
                </Link>
              );
            })}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SideBarLink({ item, pathname, onClick }) {
  const Icon = item.icon;
  const isActive = pathname === item.link || pathname.includes(item.link);

  if (item.subItems) {
    return <SubMenu item={item} pathname={pathname} onClick={onClick} />;
  }

  return (
    <Link
      to={item.link}
      className={`flex items-center px-3 gap-x-3 mb-2 rounded-sm py-2 group transition-all duration-300 ease-in-out ${
        isActive ? "bg-green-500/15 text-main-green" : "hover:bg-green-500/25"
      }`}
      onClick={onClick}
    >
      <span className="text-xl">
        <Icon className="text-main-green" />
      </span>
      <span>{item.title}</span>
    </Link>
  );
}

export default SidebarNav;

