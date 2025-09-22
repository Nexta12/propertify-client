import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { paths } from "@routes/paths";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@utils/localStorage";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoGreen from "@assets/img/green-logo.png";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import FullPageLoader from "./FullPageLoader";
import { httpError } from "@pages/errorPages/ErrorCodes";

const VerifyOTP = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  useEffect(() => {
    const getOtpPage = getLocalStorageItem("otp");
    if (!getOtpPage) {
      navigate(paths.login);
    } else {
      setShowPage(true);
    }
  }, [navigate]);

  useEffect(() => {
    const email = getLocalStorageItem("otpEmail");
    if (email) {
      const fetchUserId = async () => {
        try {
          const res = await apiClient.post(endpoints.getUserId, {
            email,
          });
          if (res.status == 200) {
            setUserId(res.data.data?._id);
          }
        } catch (error) {
          toast.error(ErrorFormatter(error));
        }
      };
      fetchUserId();
    }
  }, []);

  const handleInputChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus to next input if value is entered
      if (value && index < 3 && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to previous input on backspace if current is empty
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain");
    if (/^\d{4}$/.test(pasteData)) {
      const pasteOtp = pasteData.split("");
      const newOtp = [...otp];
      for (let i = 0; i < 4; i++) {
        if (pasteOtp[i]) {
          newOtp[i] = pasteOtp[i];
        }
      }
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all OTP fields are filled
    if (otp.some((digit) => !digit)) {
      toast.error("Please enter all OTP digits");
      return;
    }

    if (!userId) {
      toast.error("Unidentified user");
      return;
    }

    const otpCode = otp.join("");

    try {
      setIsLoading(true);
      await apiClient.post(endpoints.verifyOtp, {
        otp: otpCode,
        userId,
      });

      removeLocalStorageItem("otp");
      removeLocalStorageItem("otpEmail");

      const resetPage = getLocalStorageItem("resetEmail");

      toast.success("Otp Verified");

      setTimeout(() => {
        if (resetPage) {
          navigate(paths.SetNewPassword);
        } else {
          navigate(paths.login);
        }
      }, 3000);
    } catch (error) {
      toast.error(ErrorFormatter(error));
      removeLocalStorageItem("otp");
      removeLocalStorageItem("otpEmail");
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const email = getLocalStorageItem("otpEmail");
    if (!email) return navigate(paths.resendOTP);

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
    }
  };

  if (!showPage) {
    return <FullPageLoader />;
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Logo Section */}
      <div className="mt-5 text-center">
        <div className="flex justify-center mb-5">
          <Link to={paths.index}>
            <img src={LogoGreen} alt="Logo" width={140} />
          </Link>
        </div>

        <header className="mb-8">
          <p className="text-[15px] text-green">Enter the 4-digit code sent to your email</p>
        </header>
      </div>

      <form id="otp-form" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center gap-3">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="text"
              value={otp[index]}
              autoFocus={index === 0}
              className="h-14 w-14 appearance-none rounded border p-4 text-center text-2xl font-extrabold outline-none text-dark bg-light-gray border-gray hover:border-gray focus:border-green focus:ring-green focus:bg-white focus:ring-2"
              pattern="[0-9]*"
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              maxLength="1"
              ref={(el) => (inputsRef.current[index] = el)}
            />
          ))}
        </div>
        <div className="mx-auto mt-4 max-w-[260px]">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full justify-center whitespace-nowrap rounded-lg text-sm font-medium bg-main-green text-white dark:text-gray-300 shadow-sm transition-colors duration-150 bg-green px-3.5 py-2.5 shadow-light-green/10 hover:bg-green focus:ring-green focus:outline-none focus:ring focus-visible:ring-green focus-visible:outline-none focus-visible:ring"
          >
            {isLoading ? "Loading..." : "Verify Account"}
          </button>
        </div>
      </form>

      {/* Login Link */}
      <div className="text-center text-sm text-[#1F3E72] my-6 dark:text-gray-300">
        Didn&apos;t receive code?{" "}
        <button
          type="button"
          onClick={() => handleResendOTP()}
          className="font-medium text-[#28B16D] hover:text-[#09C269]"
        >
          Resend otp
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
