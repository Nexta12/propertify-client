import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avater from "@assets/img/avater.png";
import { FiUser, FiHome, FiInbox, FiLogOut } from "react-icons/fi";

const DeskTopUserMenu = () => {
  const { user, logout } = useAuthStore();
  const [userMenuDropdown, setUserMenuDropdown] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleUserMenuToggle = (e) => {
    e.stopPropagation();
    setUserMenuDropdown(!userMenuDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-8 h-8 rounded-full bg-[#28B16D] flex items-center justify-center text-white">
      <div ref={userMenuRef} className="relative  ">
        <div className="relative cursor-pointer" onClick={handleUserMenuToggle}>
          <img
            src={user?.profilePic || Avater}
            alt="user"
            className="w-[35px] h-[35px] rounded-full object-cover border border-neutral-100 p-[3px] "
          />
        </div>

        <div
          role="menu"
          aria-hidden={!userMenuDropdown}
          aria-labelledby="userMenuDropdown-menu-button"
          className={`
    ${!userMenuDropdown ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
    absolute w-56 p-2 rounded-lg bg-white dark:bg-gray-800 top-12 z-50 right-0 shadow-xl
    border border-gray-100 dark:border-gray-700
    transition-all duration-200 ease-out origin-top-right
  `}
        >
          <div className="flex flex-col gap-1 py-1">
            <Link
              to={`${paths.protected}/dashboard`}
              onClick={() => setUserMenuDropdown(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200
               rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <FiUser className="w-5 h-5 mr-3 text-gray-400" />
              Dashboard
            </Link>

            <Link
              to={`${paths.protected}/properties/all`}
              onClick={() => setUserMenuDropdown(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200
               rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <FiHome className="w-5 h-5 mr-3 text-gray-400" />
              My Properties
            </Link>

            <Link
              to={`${paths.protected}/settings`}
              onClick={() => setUserMenuDropdown(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200
               rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <FiUser className="w-5 h-5 mr-3 text-gray-400" />
              Account
            </Link>

            <Link
              to={`${paths.protected}/messages`}
              onClick={() => setUserMenuDropdown(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200
               rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <FiInbox className="w-5 h-5 mr-3 text-gray-400" />
              Messages
            </Link>

            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

            <button
              onClick={() => logout(navigate)}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400
               rounded-md hover:bg-red-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeskTopUserMenu;
