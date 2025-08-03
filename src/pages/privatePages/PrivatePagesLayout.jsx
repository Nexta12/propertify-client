
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import MobileHeader from "./dashboard/components/MobileHeader";
import DesktopSidebar from "./dashboard/components/DesktopSidebar";
import DesktopTopbar from "./dashboard/components/DesktopTopbar";
import { ToastContainer } from "react-toastify";


const PrivatePagesLayout = () => {
  const notifications = 2;
  const navigate = useNavigate();
  const { user, isAuthenticated, validateAuth } = useAuthStore();
  const [authLoading, setAuthLoading] = useState(false);


  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      try {
        await validateAuth();
      } finally {
        setAuthLoading(false);
      }
    };
    verifyAuth();
  }, [validateAuth]);

  useEffect(() => {
    if (!user && !isAuthenticated) {
      navigate(paths.index);
    } else if (user && !isAuthenticated) {
      setAuthLoading(true);
    }
    // else if (!user.firstName && !user.lastName) {
    //   setIsModalOpen(true)
    // }
  }, [user, isAuthenticated, navigate]);

  if (authLoading || !user) {
    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-1px)] bg-bg-green font-sans items-center justify-center">
        <PuffLoader height="80" width="80" radius={1} color="#4866ff" />
      </div>
    );
  }




  if (isAuthenticated) {
    return (
      <div className="bg-gray-50 font-sans p-0 m-0 min-h-screen">
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        {/* Fixed Top Navigation */}
        <MobileHeader notifications={notifications} />
        <div className="sticky top-0 z-50 bg-white shadow">
          <DesktopTopbar notifications={notifications} />
        </div>

        <div className="flex items-start  max-w-[1440px] mx-auto lg:pl-4">
          {/* Sidebar */}
          <aside className="hidden md:block w-[310px] bg-white h-screen shadow-md overflow-y-auto mt-5  max-h-[calc(100vh-80px)] sticky top-[80px]">
            <DesktopSidebar />
          
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full min-h-screen px-4 mt-20 md:mt-5">
            <Outlet />
          </main>
        </div>
        
      </div>
    );
  }

  return null;
};

export default PrivatePagesLayout;

