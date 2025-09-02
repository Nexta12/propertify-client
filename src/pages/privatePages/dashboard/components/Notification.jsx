import { FiBell, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@store/authStore";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { toast } from "react-toastify";
import useSocket from "@context/useSocket";

const Notification = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const socket = useSocket();
  const { user } = useAuthStore();

  const [notifications, setNotifications] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  useEffect(() => {
    if (!socket || !user?.id) return;

    const handleNewNotification = (notice) => {
      setNotifications((prev) => [notice, ...prev]);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, user?.id]);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get(
          `${endpoints.getUserNotifications}/${user?.id}`
        );

        setNotifications(response.data.data);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      }
    };

    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const unreadCount = notifications?.filter((n) => !n.isSeen).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSeen = async (notifId) => {
    try {
      await apiClient.put(`${endpoints.markNotificationAsSeen}/${notifId}`);
      // Update local state
      setNotifications((prevNotifs) =>
        prevNotifs.map((notif) =>
          notif._id === notifId ? { ...notif, isSeen: true } : notif
        )
      );


    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  const handleDelete = async (notifId) => {
    try {
      await apiClient.delete(`${endpoints.deleteNotification}/${notifId}`);
      setNotifications((prevNotifs) =>
        prevNotifs.filter((notif) => notif._id !== notifId)
      );
      setMenuOpenId(null);
    } catch (error) {
      toast.error(ErrorFormatter(error));
    }
  };

  return (
   <div className="relative" ref={dropdownRef}>
  <button
    onClick={() => setOpen(!open)}
    className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 group transition"
  >
    <FiBell className="text-gray-600 text-xl dark:text-gray-300 group-hover:dark:text-white transition-colors duration-200" />

    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-ping-fast">
        {unreadCount}
      </span>
    )}
  </button>

  <AnimatePresence>
    {open && (
      <Motion.div
        key="notification-dropdown"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute -right-5 md:right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 z-50"
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200">
          Notifications
        </div>
        <div className=" min-h-20 max-h-60 overflow-y-auto">
          {notifications?.length > 0 ? (
            notifications.map((notif, index) => (
              <div
                key={notif._id || index}
                className={`relative flex px-4 py-3 transition-all border-b last:border-none
                  hover:bg-gray-100 dark:hover:bg-gray-800 
                  border-gray-100 dark:border-gray-700
                  ${!notif.isSeen ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"}`}
              >
                <div
                  onClick={() => handleSeen(notif._id)}
                  className="cursor-pointer flex-1"
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-400 dark:text-gray-500 block mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenId((prev) =>
                        prev === notif._id ? null : notif._id
                      )
                    }
                    className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                  >
                    <FiMoreVertical />
                  </button>

                  {menuOpenId === notif._id && (
                    <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 rounded w-28 z-50">
                      <button
                        onClick={() => handleDelete(notif._id)}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <FiTrash2 className="text-base" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center">
              No notifications.
            </div>
          )}
        </div>
      </Motion.div>
    )}
  </AnimatePresence>
</div>

  );
};

export default Notification;
