import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { formatTitleCase } from "@utils/helper";
import { FiSearch } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import GreenLogo from "@assets/img/green-logo.png";
import WhiteLogo from "@assets/img/white-logo.png";
import Notification from "./Notification";
import DeskTopUserMenu from "./DeskTopUserMenu";
import useSearchStore from "@store/searchStore";
import ToggleSwitch from "@components/toggleSwitch/ToggleSwitch";


const DesktopTopbar = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isFeedPage = location.pathname === "/p/feed";
  const { setDeskTopSearchTerm } = useSearchStore();


  return (
    <header className="hidden lg:flex bg-white dark:bg-gray-800 dark:text-gray-300 shadow-sm pr-3 justify-between items-center sticky top-0 z-10 ">
     <div className="hidden p-4 md:flex items-start gap-3">
  <Link to={paths.index}>
    <div>
      {/* Light Mode Logo */}
      <img src={GreenLogo} alt="Logo" width={130} className="block dark:hidden" />

      {/* Dark Mode Logo */}
      <img src={WhiteLogo} alt="Logo" width={130} className="hidden dark:block" />
    </div>
  </Link>
</div>


        {isFeedPage && (
       <div className="flex items-center bg-gray-100 dark:bg-transparent border dark:border-gray-300 rounded-lg px-4 py-2 w-96">
  <FiSearch className="text-gray-500 mr-2 dark:text-gray-300" />
  <input
    type="text"
    placeholder="Search Propertify..."
    className="bg-transparent border-none outline-none w-full text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 dark:placeholder:text-gray-300 "
    onChange={(e) => setDeskTopSearchTerm(e.target.value)}
  />
</div>

      )}


      <div className="flex items-center space-x-4">
          <ToggleSwitch />
        <Notification />

        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.title} {user?.lastName} {user?.firstName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {formatTitleCase(user?.profession)}
            </p>
          </div>

          <DeskTopUserMenu />
        </div>
      </div>
    </header>
  );
};

export default DesktopTopbar;
