import SidebarNav from "./SidebarNav";

const MobileSidebar = ({ sidepanel, handleSidepanel }) => {
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
