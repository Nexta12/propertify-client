import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#E8F5E9] dark:bg-gray-900 flex items-center justify-center p-4">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
