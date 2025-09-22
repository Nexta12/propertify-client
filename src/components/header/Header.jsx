import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { useEffect, useRef, useState } from "react";
import { CiLogin } from "react-icons/ci";
import { MdMenu, MdOutlineClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Avater from "@assets/img/avater.png";
import { getLoggedInUserPath } from "@utils/helper";
import { FiUser, FiHome, FiInbox, FiLogOut } from "react-icons/fi";
import LogoGreen from "@assets/img/green-logo.png";
import LogoWhite from "@assets/img/white-logo.png";

import { FaUser } from "react-icons/fa";

const HeaderMenu = [
  { title: "Home", link: paths.index },
  { title: "Properties", link: paths.properties },
  { title: "Companies", link: paths.companies },
  { title: "Professionals", link: paths.professionals },
];

const Header = () => {
  const { user, isAuthenticated, validateAuth, logout } = useAuthStore();
  const [userMenuDropdown, setUserMenuDropdown] = useState(false);
  const [sidepanel, setSidepanel] = useState(false);
  const [sticky, setIsSticky] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [scrollDirection, setScrollDirection] = useState(null);
  const prevScrollY = useRef(0);
  const [hideOnScroll, setHideOnScroll] = useState(false);

  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const handleSidepanel = () => setSidepanel(!sidepanel);

  useEffect(() => {
    const verifyAuth = async () => {
      await validateAuth();
    };
    verifyAuth();
  }, [validateAuth]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Sticky handling
      if (currentScrollY > 0.5) {
        setIsSticky(true);
        setScrolled(true);
      } else {
        setIsSticky(false);
        setScrolled(false);
      }

      // Only apply hide/show on mobile
      if (window.innerWidth < 1024) {
        if (currentScrollY > prevScrollY.current) {
          setScrollDirection("down");
          setHideOnScroll(true);
        } else if (currentScrollY < prevScrollY.current) {
          setScrollDirection("up");
          setHideOnScroll(false);
        }
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!scrollDirection) void scrollDirection;

  return (
    <header
      className={` w-full z-50 transition-transform duration-300 section-container ${
        sticky ? "fixed top-0" : "relative"
      } ${
        scrolled ? "bg-white dark:bg-gray-800" : "bg-white dark:bg-gray-900"
      } ${hideOnScroll ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className=" flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <button
            onClick={handleSidepanel}
            className="lg:hidden text-2xl text-gray-600 dark:text-gray-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {sidepanel ? <MdOutlineClose /> : <MdMenu />}
          </button>

          <a href="/" className="flex-shrink-0">
            <img src={LogoGreen} className="w-[120px] lg:w-[140px] dark:hidden" alt="Logo" />
            <img src={LogoWhite} className="w-[120px] lg:w-[140px] hidden dark:block" alt="Logo" />
          </a>
        </div>

        <nav className="hidden lg:flex space-x-6">
          {HeaderMenu.map((item, index) => (
            <a
              href={item.link}
              key={index}
              className="primaryText hover:text-main-green dark:text-gray-200 dark:hover:text-green-400 transition-colors duration-200"
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div ref={userMenuRef} className="relative">
              <div className="relative cursor-pointer" onClick={handleUserMenuToggle}>
                <img
                  src={user?.profilePic || Avater}
                  alt="user"
                  className="w-[35px] h-[35px] rounded-full object-cover border border-neutral-100 p-[3px]"
                />
              </div>

              <div
                role="menu"
                aria-hidden={!userMenuDropdown}
                className={`${
                  !userMenuDropdown
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "opacity-100 scale-100"
                } absolute w-56 p-2 rounded-lg bg-white dark:bg-gray-800 top-12 z-50 right-0 shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-200 ease-out origin-top-right`}
              >
                <div className="flex flex-col gap-1 py-1">
                  <Link
                    to={getLoggedInUserPath(user)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiUser className="w-5 h-5 mr-3 text-gray-400" />
                    Dashboard
                  </Link>

                  <Link
                    to={`${paths.protected}/properties/all`}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiHome className="w-5 h-5 mr-3 text-gray-400" />
                    My Properties
                  </Link>

                  <Link
                    to={`${paths.protected}/settings`}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FaUser className="w-5 h-5 mr-3 text-gray-400" />
                    Account
                  </Link>

                  <Link
                    to={`${paths.protected}/messages`}
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
          ) : (
            <>
              <Link
                to={paths.login}
                className="hidden lg:inline-block primaryText hover:text-main-green dark:text-gray-200 dark:hover:text-green-400 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to={paths.register}
                className="btn btn-primary btn-sm !text-[14px] hover:scale-105 transition-transform duration-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sidepanel */}
      <div
        className={`fixed inset-0 bg-white dark:bg-gray-900 z-40 transform ${
          sidepanel ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden mt-[60px] h-[calc(100vh-60px)]`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {HeaderMenu.map((item, index) => (
              <a
                key={index}
                href={item.link}
                onClick={handleSidepanel}
                className="block p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-bg-green dark:hover:bg-gray-800 hover:text-main-green dark:hover:text-main-green transition-colors duration-200 text-gray-900 dark:text-gray-100"
              >
                {item.title}
              </a>
            ))}

            {!isAuthenticated ? (
              <Link
                to={paths.login}
                onClick={handleSidepanel}
                className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-bg-green dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <CiLogin className="text-2xl" />
                <span className="orangeText">Sign In</span>
              </Link>
            ) : (
              <Link
                to={"#"}
                onClick={() => logout(navigate)}
                className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-bg-green dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="orangeText">Logout</span>
              </Link>
            )}
          </div>

          <div className="p-4 bg-tertiary dark:bg-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              © {new Date().getFullYear()} Propertify Nigeria. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
