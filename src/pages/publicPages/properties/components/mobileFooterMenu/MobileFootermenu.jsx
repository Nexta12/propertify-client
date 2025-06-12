import { useEffect, useRef, useState } from "react";
import { FiHome, FiShoppingCart, FiUserX } from "react-icons/fi";
import { MdGroup } from "react-icons/md";
import { Link } from "react-router-dom";

const MobileFootermenu = () => {
      const [scrolled, setScrolled] = useState(false);
      const [scrollDirection, setScrollDirection] = useState(null); // Start with null
      const prevScrollY = useRef(0);
    
      useEffect(() => {
        const handleScroll = () => {
          const currentScrollY = window.scrollY;
    
          // Determine scroll direction
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
          !scrolled || scrollDirection === "down" ? "fixed bottom-0" : "hidden"
        } bg-white text-center lg:hidden border-t transition-transform duration-300`}
      >
        <ul className="flex items-center justify-between px-5">
            <Link to={"/"}>
            <li  className="flex flex-col items-center px-4 py-2 transition-all duration-150 ease-in hover:bg-neutral-200" >
                <span className="text-neutral-800 text-2xl" ><FiHome/></span>
                <span className="text-sm text-gray-500">Home</span>
            </li>
            </Link>
             <Link to={"#"}>
            <li className="flex flex-col items-center px-4 py-2 transition-all duration-150 ease-in hover:bg-neutral-200" >
                <span className="text-neutral-800 text-2xl" ><MdGroup/></span>
                <span className="text-sm text-gray-500" >Agents</span>
            </li>
            </Link>
              <Link to={"#"}>
            <li className="flex flex-col items-center px-4 py-2 transition-all duration-150 ease-in hover:bg-neutral-200" >
                <span className="text-neutral-800 text-2xl" ><FiUserX/></span>
                <span className="text-sm text-gray-500" >Services</span>
            </li>
            </Link>
               <Link to={"#"}>
            <li className="flex flex-col items-center px-4 py-2 transition-all duration-150 ease-in hover:bg-neutral-200" >
                <span className="text-neutral-800 text-2xl" ><FiShoppingCart/></span>
                <span className="text-sm text-gray-500" >Marketplace</span>
            </li>
            </Link>
        </ul>
       
      </div>
  )
}

export default MobileFootermenu