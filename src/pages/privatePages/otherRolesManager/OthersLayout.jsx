import DesktopSidebar from "@pages/privatePages/components/DesktopSidebar";
import DesktopTopbar from "@pages/privatePages/components/DesktopTopbar";
import MobileHeader from "@pages/privatePages/components/MobileHeader";
import MobileSidebar from "@pages/privatePages/components/MobileSidebar";
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { UserRole } from "@utils/constant";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";

const OthersLayout = () => {
  const notifications = 2;

  const navigate = useNavigate();
  const { user, isAuthenticated, validateAuth } = useAuthStore();
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      try {
        await validateAuth(); // Ensure validateAuth works properly
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, [validateAuth]);

  useEffect(() => {
    if (!user && !isAuthenticated) {
      navigate(paths.index); //
    } else if (user && !isAuthenticated) {
      setAuthLoading(true);
    }
  }, [user, isAuthenticated, navigate]);

  // Screen Roles

  useEffect(() => {
    if (!user) {
      // Redirect to Index if no user is present
      navigate(paths.index);
      return;
    }
    switch (user?.role) {
      case UserRole.ENGINEER:
      case UserRole.SERVICE:
      case UserRole.TRADER:
        // User has a valid role, no action needed
        break;
      case UserRole.ADMIN:
        navigate(paths.adminDashboard);
        break;
      case UserRole.REALTOR:
        navigate(paths.agentDashboard);
        break;
      default:
        // Redirect to the index page if the role is invalid
        navigate(paths.index);
        break;
    }
  }, [user, navigate]);

  if (authLoading || !user) {

    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-bg-green font-sans items-center justify-center">
        {" "}
        <PuffLoader
              height="80"
              width="80"
              radius={1}
              color="#4866ff"
              area-label="puff-loading"
            />
      </div>
    );
  }
  if(isAuthenticated){

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-gray-50 font-sans">
      {/* Mobile Header */}
      <MobileHeader notifications={notifications} />
      {/* Mobile Sidebar */}
      <MobileSidebar />
      {/* Sidebar - Desktop */}
      <DesktopSidebar />
      {/* Main Content Starts */}

      <div className="flex-1 overflow-auto">
        {/* Top Bar - Desktop */}
        <DesktopTopbar notifications={notifications} />

        {/* Dashboard Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
};

export default OthersLayout;
