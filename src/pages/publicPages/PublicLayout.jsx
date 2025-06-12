import Header from "@components/header/Header";
import Footer from "@components/footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

const PublicLayout = () => {

   const location = useLocation();
  
  // List of paths where footer should be hidden on mobile
  const hideFooterOnMobilePaths = [
    '/properties',
  ];

  const shouldHideFooter = hideFooterOnMobilePaths.includes(location.pathname);

  return (
    <div className="bg-white p-0 m-0">
      <Header />
      <Outlet />
        {/* Hide footer on mobile for specified paths */}
      <div className={`${shouldHideFooter ? 'hidden lg:block' : ''}`}>
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
