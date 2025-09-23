import { useEffect, useState } from "react";
import { DashBoardMenuItems } from "@utils/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "@store/authStore";
import { BsChevronDown } from "react-icons/bs";
import { AnimatePresence, motion as Motion } from "framer-motion";
import ToggleSwitch from "@components/toggleSwitch/ToggleSwitch";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { toast } from "react-toastify";
import useSocket from "@context/useSocket";

const SidebarNav = ({ handleSidepanel }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [notificationCounts, setNotificationCounts] = useState({});
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !user?.id) return;

    const handleNewNotification = (newNotif) => {
      // Merge with current counts
      setNotificationCounts((prevCounts) => {
        const newCounts = getNotificationCounts([newNotif]);
        return {
          ...prevCounts,
          ...Object.keys(newCounts).reduce((acc, key) => {
            acc[key] = (prevCounts[key] || 0) + newCounts[key];
            return acc;
          }, {}),
        };
      });
    };

    // Handle seen notifications (decrement counts)
    const handleNotificationSeen = async (seenNotif) => {
      await apiClient.put(`${endpoints.markNotificationAsSeen}/${seenNotif._id}`);
      setNotificationCounts((prevCounts) => {
        const type = seenNotif.type;
        if (!prevCounts[type]) return prevCounts;

        const updatedCount = prevCounts[type] - 1;
        return {
          ...prevCounts,
          [type]: updatedCount > 0 ? updatedCount : 0,
        };
      });
    };

    const handleNotificationDelete = async (seenNotif) => {
      setNotificationCounts((prevCounts) => {
        const type = seenNotif.type;
        if (!prevCounts[type]) return prevCounts;

        const updatedCount = prevCounts[type] - 1;
        return {
          ...prevCounts,
          [type]: updatedCount > 0 ? updatedCount : 0,
        };
      });
    };

    socket.on("newNotification", handleNewNotification);
    socket.on("notificationSeen", handleNotificationSeen);
    socket.on("deletedNotice", handleNotificationDelete);

    return () => {
      socket.off("newNotification", handleNewNotification);
      socket.off("notificationSeen", handleNotificationSeen);
      socket.off("deletedNotice", handleNotificationDelete);
    };
  }, [socket, user?.id]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get(`${endpoints.getUserNotifications}/${user?.id}`);

        const notifs = response.data.data;

        // Convert to counts
        setNotificationCounts(getNotificationCounts(notifs));
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const getNotificationCounts = (notifications) => {
    return notifications.reduce((acc, notif) => {
      if (!notif.isSeen) {
        acc[notif.type] = (acc[notif.type] || 0) + 1;
      }
      return acc;
    }, {});
  };

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <nav
      className="p-4 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 overflow-y-auto rounded-t-lg"
      style={{ height: "inherit" }}
    >
      {DashBoardMenuItems.map((item, i) => {
        if (!item.visibility.includes(user?.role)) return null;

        let resolvedItem = {
          ...item,
          notificationCount: notificationCounts[item.type] || 0,
        };

        // Attach counts to subItems (if any)
        if (item.subItems) {
          resolvedItem.subItems = item.subItems.map((sub) => ({
            ...sub,
            notificationCount: notificationCounts[sub.type] || 0,
          }));
        }

        if (item.title === "Profile" && user?.slug) {
          resolvedItem.link = `${item.link.replace(":slug", "")}${user.slug}`;
        }

        if (item.title === "Logout") {
          return (
            <SideBarLink key={i} item={resolvedItem} pathname={pathname} onClick={handleLogout} />
          );
        }

        return (
          <SideBarLink key={i} item={resolvedItem} pathname={pathname} onClick={handleSidepanel} />
        );
      })}
      <div className="lg:hidden flex justify-end px-3 py-2">
        <ToggleSwitch />
      </div>
    </nav>
  );
};

function SubMenu({ item, pathname, onClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;
  const { user } = useAuthStore();

  const visibleSubItems = item.subItems.filter(
    (subItem) => !subItem.visibility || subItem.visibility.includes(user?.role)
  );

  const isActive = visibleSubItems?.some(
    (subItem) => pathname === subItem.link || pathname.includes(subItem.link)
  );

  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive, pathname]);

  return (
    <div className="mb-2">
      {/* Parent Menu */}

      <div
        className={`flex items-center px-3 gap-x-3 py-2 rounded-sm cursor-pointer transition-all 
    ${
      isActive
        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
    }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className="text-green-600 dark:text-green-400 text-xl" />

        <div className="flex items-center justify-between flex-1 text-[18px] sm:text-[16px]">
          <span>{item.title}</span>
          <div className="flex items-center gap-x-2">
            {item.notificationCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {item.notificationCount}
              </span>
            )}
            <BsChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </div>
      </div>

      {/* Sub Items */}
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
              const isSubActive = pathname === subItem.link || pathname.includes(subItem.link);
              return (
                <Link
                  key={index}
                  to={subItem.link}
                  onClick={onClick}
                  className={`flex items-center justify-between px-3 py-1.5 mb-1 text-[18px] sm:text-[16px] rounded-sm transition-colors
                    ${
                      isSubActive
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  <span>{subItem.title}</span>
                  {subItem.notificationCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                      {subItem.notificationCount}
                    </span>
                  )}
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
      className={`flex items-center justify-between px-3 gap-x-3 text-[18px] sm:text-[16px] mb-2 py-2 group transition-all duration-300 ease-in-out rounded-md 
        ${
          isActive
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
        }`}
      onClick={onClick}
    >
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-x-3">
        <span className="text-xl">
          <Icon className="text-green-600 dark:text-green-400" />
        </span>
        <span>{item.title}</span>
      </div>

      {/* Right: Notification Count */}
      {item.notificationCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {item.notificationCount}
        </span>
      )}
    </Link>
  );
}

export default SidebarNav;
