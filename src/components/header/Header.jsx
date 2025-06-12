import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { useEffect, useRef, useState } from "react";
import { CiLogin } from "react-icons/ci";
import { MdMenu, MdOutlineClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Avater from "@assets/img/avater.png";
import { getLoggedInUserPath } from "@utils/helper";
import { FiUser, FiHome, FiCalendar, FiInbox, FiLogOut } from "react-icons/fi";
import LogoGreen from "@assets/img/green-logo.png";

const HeaderMenu = [
  { title: "Home", link: paths.index },
  { title: "Properties", link: paths.properties },
  { title: "Construction", link: "#" },
  { title: "Building Materials", link: "#" },
  { title: "Decorators", link: "#" },
];

const Header = () => {
  const { user, isAuthenticated, validateAuth, logout } = useAuthStore();
  const [userMenuDropdown, setUserMenuDropdown] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const [sidepanel, setSidepanel] = useState(false);
  const [sticky, setIsSticky] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleSidepanel = () => setSidepanel(!sidepanel);

  useEffect(() => {
    const verifyAuth = async () => {
      await validateAuth(); // Ensure validateAuth works properly
    };
    verifyAuth();
  }, [validateAuth]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0.5) {
        setIsSticky(true);
        setScrolled(true);
      } else {
        setIsSticky(false);
        setScrolled(false);
      }
    };

    // Add smooth behavior to html element
    document.documentElement.style.scrollBehavior = "smooth";

    // Use requestAnimationFrame for smoother scroll detection
    let animationFrameId;
    const debouncedScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", debouncedScroll);
    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      cancelAnimationFrame(animationFrameId);
      document.documentElement.style.scrollBehavior = "auto";
    };
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={` w-full z-50 transition-all duration-300  ${
        sticky ? "sticky top-0" : "relative top-0  "
      } ${scrolled ? "bg-white" : "bg-white"} `}
    >
      <div className="section-container flex items-center justify-between py-3">
        {/* Left Section - Logo and Menu */}
        <div className="flex items-center gap-8">
          {/* Mobile Menu Button */}
          <button
            onClick={handleSidepanel}
            className="lg:hidden text-2xl text-gray-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {sidepanel ? <MdOutlineClose /> : <MdMenu />}
          </button>

          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img
              src={LogoGreen}
              className="w-[120px] lg:w-[140px]"
              alt="Logo"
            />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-6">
            {HeaderMenu.map((item, index) => (
              <a
                href={item.link}
                key={index}
                className="primaryText hover:text-main-green transition-colors duration-200"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Section - Auth Buttons */}
        <div className="flex items-center gap-4">

          {isAuthenticated ? (
            <div ref={userMenuRef} className="relative  ">
              <div
                className="relative cursor-pointer"
                onClick={handleUserMenuToggle}
              >
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
    ${
      !userMenuDropdown
        ? "opacity-0 scale-95 pointer-events-none"
        : "opacity-100 scale-100"
    }
    absolute w-56 p-2 rounded-lg bg-white dark:bg-gray-800 top-12 z-50 right-0 shadow-xl
    border border-gray-100 dark:border-gray-700
    transition-all duration-200 ease-out origin-top-right
  `}
              >
                <div className="flex flex-col gap-1 py-1">
                  <Link
                    to={getLoggedInUserPath(user)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200
               rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiUser className="w-5 h-5 mr-3 text-gray-400" />
                    Dashboard
                  </Link>

                  <Link
                    to={`${paths.agent}/properties`}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200
               rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiHome className="w-5 h-5 mr-3 text-gray-400" />
                    My Properties
                  </Link>

                  <Link
                    to={`${paths.agent}/properties`}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200
               rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiCalendar className="w-5 h-5 mr-3 text-gray-400" />
                    Schedules
                  </Link>

                  <Link
                    to={`${paths.agent}/properties`}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200
               rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <FiInbox className="w-5 h-5 mr-3 text-gray-400" />
                    Leads & Inquiries
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
          ) : (
            <>
              <Link
                to={paths.login}
                className="hidden lg:inline-block primaryText hover:text-main-green transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to={paths.register}
                className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200"
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>

      {/* Mobile Side Panel */}
      <div
        className={`fixed inset-0 bg-white z-40 transform ${
          sidepanel ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden mt-[60px] h-[calc(100vh-60px)]`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Items */}
          <div className="flex-1 overflow-y-auto">
            {HeaderMenu.map((item, index) => (
              <a
                key={index}
                href={item.link}
                onClick={handleSidepanel}
                className="block p-4 border-b border-gray-100 hover:bg-bg-green hover:text-main-green transition-colors duration-200"
              >
                {item.title}
              </a>
            ))}

            {!isAuthenticated ? (
              <Link
                to={paths.login}
                onClick={handleSidepanel}
                className="flex items-center gap-2 p-4 border-b border-gray-100 hover:bg-bg-green"
              >
                <CiLogin className="text-2xl" />
                <span className="orangeText">Sign In</span>
              </Link>
            ) : (
              <Link
              to={"#"}
                onClick={() => logout(navigate)}
                className="flex items-center gap-2 p-4 border-b border-gray-100 hover:bg-bg-green"
              >
                <FiLogOut className="w-5 h-5" />
               
                <span className="orangeText">Logout</span>
              </Link>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-tertiary text-center">
            <p className="text-white/70 text-xs">
              © {new Date().getFullYear()} Propertify Nigeria. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
