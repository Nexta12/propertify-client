import { useMenuStore } from "@store/MenuStore";

import SidebarNav from "./SidebarNav";



const MobileSidebar = () => {
  const { mobileMenuOpen, toggleMobileMenu } = useMenuStore();

  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${
        mobileMenuOpen ? "block" : "hidden"
      }`}
    >
      {/* Mobile Menu Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={toggleMobileMenu}
      ></div>

      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <SidebarNav />
      </div>
    </div>
  );
};

export default MobileSidebar;
