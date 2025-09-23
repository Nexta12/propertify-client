import { useEffect, useState } from "react";
import SidebarNav from "./SidebarNav";

const MobileSidebar = ({ sidepanel, handleSidepanel }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 913);

  // Watch for screen resize to update `isMobile`
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 913);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock/unlock scroll only on mobile
  useEffect(() => {
    if (isMobile) {
      if (sidepanel) {
        document.body.style.overflow = "hidden"; // lock scroll
      } else {
        document.body.style.overflow = ""; // restore scroll
      }
    }

    return () => {
      document.body.style.overflow = ""; // cleanup on unmount
    };
  }, [sidepanel, isMobile]);

  return (
    <div
      className={`fixed bg-neutral-500 inset-0 z-40 transform ${
        sidepanel ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:hidden mt-[60px] h-[calc(100vh-60px)]`}
    >
      <SidebarNav handleSidepanel={handleSidepanel} />
    </div>
  );
};

export default MobileSidebar;
