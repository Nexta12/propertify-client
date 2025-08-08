import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { useEffect, useRef, useState } from "react";
import { FiHome, FiUserX } from "react-icons/fi";
import { MdGroup, MdRssFeed, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const MobileFootermenu = ({ onSearchClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null); // Start with null
  const prevScrollY = useRef(0);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Determine scroll direction
      if (currentScrollY < prevScrollY.current) {
        setScrollDirection("down");
      } else if (currentScrollY > prevScrollY.current) {
        setScrollDirection("up");
      }

      // Update previous scroll position
      prevScrollY.current = currentScrollY;

      // Update previous scroll position
      prevScrollY.current = currentScrollY;

      // Set scrolled state (true if scrolled at all)
      setScrolled(currentScrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
   <div
  className={`w-full ${
    !scrolled || scrollDirection === "down"
      ? "fixed bottom-0 !left-0"
      : "hidden"
  } bg-white dark:bg-gray-900 text-center lg:hidden border-t dark:border-gray-700 transition-transform duration-300`}
>
  <ul className="flex items-center justify-between px-2">
    <Link to={`${user ? paths.feed : paths.index}`}>
      <li className="flex flex-col items-center px-2 py-2 transition-all duration-150 ease-in hover:bg-neutral-200 dark:hover:bg-gray-800">
        <span className="text-neutral-800 dark:text-gray-100 text-xl">
          <FiHome />
        </span>
        <span className="text-[13px] text-gray-500 dark:text-gray-300">Home</span>
      </li>
    </Link>

    <Link to={`${user ? paths.feed : paths.properties}`}>
      <li className="flex flex-col items-center px-2 py-2 transition-all duration-150 ease-in hover:bg-neutral-200 dark:hover:bg-gray-800">
        <span className="text-neutral-800 dark:text-gray-100 text-xl">
          <MdRssFeed />
        </span>
        <span className="text-[13px] text-gray-500 dark:text-gray-300">Posts</span>
      </li>
    </Link>

    <li
      className="flex flex-col items-center px-2 py-2 transition-all duration-150 ease-in hover:bg-neutral-200 dark:hover:bg-gray-800"
      onClick={onSearchClick}
    >
      <span className="text-neutral-800 dark:text-gray-100 text-xl">
        <MdSearch />
      </span>
      <span className="text-[13px] text-gray-500 dark:text-gray-300">Search</span>
    </li>

    <Link to={paths.professionals}>
      <li className="flex flex-col items-center px-2 py-2 transition-all duration-150 ease-in hover:bg-neutral-200 dark:hover:bg-gray-800">
        <span className="text-neutral-800 dark:text-gray-100 text-xl">
          <MdGroup />
        </span>
        <span className="text-[13px] text-gray-500 dark:text-gray-300">Professionals</span>
      </li>
    </Link>

    {user && (
      <button>
        <li className="flex flex-col items-center px-2 py-2 transition-all duration-150 ease-in hover:bg-neutral-200 dark:hover:bg-gray-800">
          <span className="text-neutral-800 dark:text-gray-100 text-xl">
            <FiUserX />
          </span>
          <span className="text-[13px] text-gray-500 dark:text-gray-300 whitespace-nowrap">
            My Posts
          </span>
        </li>
      </button>
    )}
  </ul>
</div>

  );
};

export default MobileFootermenu;
