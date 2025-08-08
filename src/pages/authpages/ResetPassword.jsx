import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { paths } from "@routes/paths";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "@utils/localStorage";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import LogoGreen from "@assets/img/green-logo.png";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import EnhancedInput from "@components/ui/EnhancedInput";
import { FiLock } from "react-icons/fi";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import FullPageLoader from "./FullPageLoader";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const validatePasswordMatch = (value) => {
    return value === formData.password;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  useEffect(() => {
    const getResetEmail = getLocalStorageItem("resetEmail");

    if (!getResetEmail) {
      navigate(paths.index);
    } else {
      setShowPage(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
     const getResetEmail = getLocalStorageItem("resetEmail");
    try {
      setIsLoading(true);
      await apiClient.post(endpoints.ResetPassword, {
        password: formData.password,
        email: getResetEmail,
        confirmPassword: formData.confirmPassword
      });

      removeLocalStorageItem("resetEmail");

      toast.success("Password reset successful");

      setTimeout(() => {
        navigate(paths.login);
      }, 3000);
    } catch (error) {
      toast.error(ErrorFormatter(error));
      removeLocalStorageItem("resetEmail");
      setIsLoading(false);
    }
  };


   if (!showPage) {
  return <FullPageLoader />;
}

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-2">
      <HandleGoBackBtn/>
      </div>
      {/* Logo Section */}
      <div className=" text-center">
        <div className="flex justify-center">
          <Link to={paths.index}>
            <img src={LogoGreen} alt="Logo" width={140} />
          </Link>
        </div>

        <header className="">
          <p className="text-[15px] text-green">
            Set New Password
          </p>
        </header>
      </div>

      <form id="otp-form" onSubmit={handleSubmit} className="p-6 space-y-4" >

        {/* Password Field */}
        <div>
          <div className="relative">
            <EnhancedInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              // forceValidate={isSubmitting}
              placeholder="Password*"
              required
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-[#8E9395] dark:text-gray-300" />
            </div>
            <EnhancedInput
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              // forceValidate={isSubmitting}
              placeholder="Confirm Password*"
              validate={validatePasswordMatch}
              errorMessage="Passwords do not match"
              required
            />
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-[260px]">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full justify-center whitespace-nowrap rounded-lg text-sm font-medium bg-main-green text-white shadow-sm transition-colors duration-150 bg-green px-3.5 py-2.5 shadow-light-green/10 hover:bg-green focus:ring-green focus:outline-none focus:ring focus-visible:ring-green focus-visible:outline-none focus-visible:ring"
          >
            {isLoading ? "Loading..." : "Reset Password"}
          </button>
        </div>
      </form>

    </div>
  );
};

export default ResetPassword;
