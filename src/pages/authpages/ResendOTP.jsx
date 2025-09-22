import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@routes/paths";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import EnhancedInput from "@components/ui/EnhancedInput";
import Button from "@components/ui/Button";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";

import { toast } from "react-toastify";
import { getLoggedInUserPath } from "@utils/helper";
import useAuthStore from "@store/authStore";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import { removeLocalStorageItem, setLocalStorageItem } from "@utils/localStorage";
import GreenLogo from "@assets/img/green-logo.png";
import { httpError } from "@pages/errorPages/ErrorCodes";
import FullPageLoader from "./FullPageLoader";

const ResendOTP = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated, validateAuth } = useAuthStore();

  const [authLoading, setAuthLoading] = useState(false);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const validateForm = () => {
    if (!email) {
      toast.error("Your email is needed");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await apiClient.post(endpoints.resendOTP, { email });
      if (res.status == 200) {
        toast.success("A new OTP was sent to your email..");
        setLocalStorageItem("otpEmail", email);
        setLocalStorageItem("otp", true);
        setTimeout(() => {
          navigate(paths.verifyOTP);
        }, 3000);
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));

      if (ErrorFormatter(error) == httpError.ValidOtp) {
        setLocalStorageItem("otpEmail", email);
        setLocalStorageItem("otp", true);
        setTimeout(() => {
          navigate(paths.verifyOTP);
        }, 3000);
      } else {
        removeLocalStorageItem("userEmail", email);
        removeLocalStorageItem("showOtpPage", true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
    if (user && isAuthenticated) {
      navigate(getLoggedInUserPath(user));
    }
  }, [user, isAuthenticated, navigate]);

  if (authLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden relative ">
        <div className="absolute top-4 left-5">
          <HandleGoBackBtn />
        </div>
        {/* Logo Section */}
        <div className=" mt-5 text-center">
          <div className="flex justify-center">
            <Link to={paths.index}>
              <img src={GreenLogo} alt="" width={140} />
            </Link>
          </div>
          <p className="text-[#8E9395] mt-1">Enter your Email to receive new OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email Field */}
          <div>
            <div className="relative">
              <EnhancedInput
                type="email"
                id="email"
                name="email"
                value={email}
                forceValidate={isSubmitting}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email*"
              />
            </div>
          </div>

          {/* Register Button */}

          <Button variant="success" type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Please Wait..." : "Submit"}
          </Button>
        </form>
      </div>
    );
  }
};

export default ResendOTP;
