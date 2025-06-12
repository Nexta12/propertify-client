import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { paths } from "@routes/paths";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "@utils/localStorage";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import LogoGreen from "@assets/img/green-logo.png";

const VerifyOTP = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  //   useEffect(() => {
  //     const getOtpPage = getLocalStorageItem('otp');
  //     if (!getOtpPage) {
  //       navigate(paths.login);
  //     } else {
  //       setShowPage(true);
  //     }
  //   }, [navigate]);

  //   useEffect(() => {
  //     const email = getLocalStorageItem('otp');
  //     if (email) {
  //       setUserEmail(email);
  //       const fetchUserId = async () => {
  //         try {
  //           const res = await apiClient.post(endpoints.getUserId, { email });
  //           setUserId(res.data.userId);
  //         } catch (error) {
  //           console.log(error);

  //         }
  //       };
  //       fetchUserId();
  //     }
  //   }, []);

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
      //   setMessage({ error: 'Please enter all OTP digits', success: null });
      return;
    }

    if (!userId) {
      //   setMessage({ error: 'User ID is missing', success: null });
      return;
    }

    const otpCode = otp.join("");

    try {
      setIsLoading(true);
      const response = await apiClient.post(endpoints.verifyOtp, {
        otp: otpCode,
        userId,
      });

      if (response.status === 200) {
        removeLocalStorageItem("otp");
        removeLocalStorageItem("otp");
        setIsLoading(false);
        // setMessage({ error: null, success: 'OTP verified successfully' });
        setTimeout(() => {
          navigate(paths.login);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //   if (!showPage) {
  //     return <PuffLoader/>
  //   }

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Logo Section */}
        <div className="mt-5 text-center">
          <div className="flex justify-center mb-5">
            <Link to={paths.index}>
              <img src={LogoGreen} alt="Logo" width={140} />
            </Link>
          </div>

          <header className="mb-8">
            <p className="text-[15px] text-green">
              Enter the 4-digit code sent to your email
            </p>
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
              className="inline-flex w-full justify-center whitespace-nowrap rounded-lg text-sm font-medium text-white shadow-sm transition-colors duration-150 bg-green px-3.5 py-2.5 shadow-light-green/10 hover:bg-green focus:ring-green focus:outline-none focus:ring focus-visible:ring-green focus-visible:outline-none focus-visible:ring"
            >
              {isLoading ? "Loading..." : "Verify Account"}
            </button>
          </div>
        </form>
      
         {/* Login Link */}
          <div className="text-center text-sm text-[#1F3E72] mb-10">
            Didn&apos;t receive code? { " "}
            <Link
              to={paths.login}
              className="font-medium text-[#28B16D] hover:text-[#09C269]"
            >
            Resend otp
            </Link>
          </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
