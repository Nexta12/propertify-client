
import useAuthStore from "@store/authStore";
import { useEffect, useRef, useState } from "react";
import {
  FiUser,
  FiHome,
  FiInbox,
  FiLogOut,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Avater from "@assets/img/avater.png";
import { paths } from "@routes/paths";
import MobileSidebar from "./MobileSidebar";
import { MdMenu, MdOutlineClose } from "react-icons/md";
import GreenLogo from "@assets/img/green-logo.png";
import WhiteLogo from "@assets/img/white-logo.png";
import Notification from "./Notification";

const MobileHeader = () => {
  const { user, logout } = useAuthStore();
  const [userMenuDropdown, setUserMenuDropdown] = useState(false);
  const [sidepanel, setSidepanel] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Scroll direction tracking
  const prevScrollY = useRef(0);
  const [hideOnScroll, setHideOnScroll] = useState(false);

  const handleSidepanel = () => setSidepanel(!sidepanel);

  const handleUserMenuToggle = (e) => {
    e.stopPropagation();
    setUserMenuDropdown(!userMenuDropdown);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY.current) {
        setHideOnScroll(true); // Scrolling down - hide
      } else if (currentScrollY < prevScrollY.current) {
        setHideOnScroll(false); // Scrolling up - show
      }
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <header
        className={`lg:hidden bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center 
        fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          hideOnScroll ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex items-center">
          <button
            onClick={handleSidepanel}
            className="lg:hidden text-2xl text-gray-600 dark:text-gray-200 focus:outline-none mr-3"
            aria-label="Toggle menu"
          >
            {sidepanel ? <MdOutlineClose size={24} /> : <MdMenu size={24} />}
          </button>

              {/* Light Mode Logo */}
                <img src={GreenLogo} alt="Logo" width={130} className="block dark:hidden" />
          
                {/* Dark Mode Logo */}
                <img src={WhiteLogo} alt="Logo" width={130} className="hidden dark:block" />

        </div>

        <div className="flex items-center space-x-3">
         <Notification/>

          <div className="w-8 h-8 rounded-full bg-[#28B16D] flex items-center justify-center text-white">
            <div ref={userMenuRef} className="relative">
              <div
                className="relative cursor-pointer"
                onClick={handleUserMenuToggle}
              >
                <img
                  src={user?.profilePic || Avater}
                  alt="user"
                  className="w-[35px] h-[35px] rounded-full object-cover border border-neutral-100 p-[3px]"
                />
              </div>

              <div
                role="menu"
                aria-hidden={!userMenuDropdown}
                aria-labelledby="userMenuDropdown-menu-button"
                className={`${
                  !userMenuDropdown
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "opacity-100 scale-100"
                } absolute w-56 p-2 rounded-lg bg-white dark:bg-gray-800 top-12 z-50 right-0 shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-200 ease-out origin-top-right`}
              >
                <div className="flex flex-col gap-1 py-1">
                  <Link
                     to={`${paths.protected}/dashboard`}
                    onClick={() => setUserMenuDropdown(false)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiUser className="w-5 h-5 mr-3 text-gray-400" />
                    Dashboard
                  </Link>

                  <Link
                    to={`${paths.protected}/properties/all`}
                    onClick={() => setUserMenuDropdown(false)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiHome className="w-5 h-5 mr-3 text-gray-400" />
                    My Properties
                  </Link>

                  <Link
                    to={`${paths.protected}/settings`}
                    onClick={() => setUserMenuDropdown(false)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiUser className="w-5 h-5 mr-3 text-gray-400" />
                    Account
                  </Link>

                  <Link
                    to={`${paths.protected}/messages`}
                    onClick={() => setUserMenuDropdown(false)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiInbox className="w-5 h-5 mr-3 text-gray-400" />
                    Messages
                  </Link>

                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                  <button
                    onClick={() => logout(navigate)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiLogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileSidebar sidepanel={sidepanel} handleSidepanel={handleSidepanel} />
    </div>
  );
};

export default MobileHeader;
