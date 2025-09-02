
import { paths } from "@routes/paths";
import useAuthStore from "@store/authStore";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import MobileHeader from "./dashboard/components/MobileHeader";
import DesktopTopbar from "./dashboard/components/DesktopTopbar";
import { ToastContainer } from "react-toastify";
import SidebarNav from "./dashboard/components/SidebarNav";

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
       <div className="bg-gray-100 p-0 m-0 dark:bg-gray-900">
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
       <MobileHeader notifications={notifications} />
        <DesktopTopbar notifications={notifications} />
        <div className="flex items-start gap-4 section-container pt-20 lg:pt-3 relative">
           <div className="hidden lg:flex min-w-[300px] max-w-[300px] min-h-screen sticky top-5 ">
             <SidebarNav />
           </div>
             
             {/* <div className=" overflow-x-auto "> */}
             <div className="flex-[2] sm:overflow-x-visible overflow-x-auto  scrollbar-hide min-h-screen   ">
              <Outlet />
             </div>
        </div>
      
    
    </div>

      
    );
  }

  return null;
};

export default PrivatePagesLayout;

