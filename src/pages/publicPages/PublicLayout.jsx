import Header from "@components/header/Header";
import Footer from "@components/footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Chatboax from "@components/chatBox/Chatboax";
import { useState } from "react";


const PublicLayout = () => {

   const location = useLocation();
  
  const [chatOpen, setChatOpen] = useState(false)
  
  // List of paths where footer should be hidden on mobile
  const hideFooterOnMobilePaths = [
    '/properties',
    '/professionals',
  ];

  const shouldHideFooter = hideFooterOnMobilePaths.includes(location.pathname);

  return (
    <div className="p-0 m-0 dark:bg-gray-900 relative ">
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <Header />
      <Outlet 
      context={{ setChatOpen }}
       />
     
      <Chatboax className="" 
       expanded={chatOpen}
        setExpanded={setChatOpen}
         />

        {/* Hide footer on mobile for specified paths */}
      <div className={`${shouldHideFooter ? 'hidden lg:block' : ''}`}>
        <Footer />
      </div>
    </div>
  )
};

export default PublicLayout;
