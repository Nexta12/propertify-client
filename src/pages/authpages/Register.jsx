import { useEffect, useState } from "react";
import { FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@routes/paths";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedSelect from "@components/ui/EnhancedSelect";
import Button from "@components/ui/Button";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { toast } from "react-toastify";
import { NigerianStates, professions } from "@utils/data";
import { getLoggedInUserPath, getRoleFromProfession } from "@utils/helper";
import useAuthStore from "@store/authStore";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import { removeLocalStorageItem, setLocalStorageItem } from "@utils/localStorage";
import GreenLogo from "@assets/img/green-logo.png";
import FullPageLoader from "./FullPageLoader";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState("user");

  const { user, isAuthenticated, validateAuth } = useAuthStore();

  const [authLoading, setAuthLoading] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    profession: "",
    state: "",
  });

  const validatePasswordMatch = (value) => {
    return value === formData.password;
  };

  const locations = NigerianStates.map((state) => ({
    label: state.state,
    value: state.state,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Extract role from chosen profession

  useEffect(() => {
    if (formData.profession) {
      setUserRole(getRoleFromProfession(formData.profession));
    }
  }, [formData.profession]);

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!formData.email || !formData.password || !formData.state || !formData.profession) {
      toast.error("Please fill all required fields");
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
      const res = await apiClient.post(endpoints.register, {
        ...formData,
        role: userRole,
      });

      if (res.status == 201) {
        toast.success("An OTP was sent to your email..");
        setLocalStorageItem("otpEmail", formData.email);
        setLocalStorageItem("otp", true);
        setTimeout(() => {
          navigate(paths.verifyOTP);
        }, 3000);
      }
    } catch (error) {
      toast.error(ErrorFormatter(error));
      removeLocalStorageItem("userEmail", formData.email);
      removeLocalStorageItem("showOtpPage", true);
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
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative ">
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
          <p className="text-[#8E9395] mt-1">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email Field */}
          <div>
            <div className="relative">
              <EnhancedInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                forceValidate={isSubmitting}
                required
                onChange={handleChange}
                placeholder="Email*"
              />
            </div>
          </div>

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
                <FiLock className="text-[#8E9395]" />
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

          {/* Profession Dropdown */}
          <div>
            <EnhancedSelect
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              // forceValidate={isSubmitting}
              options={professions}
              errorMessage="Select your profession"
              placeholder="Select your profession*"
              required
            />
          </div>

          {/* Location Dropdown */}
          <div>
            <EnhancedSelect
              id="location"
              name="state"
              value={formData.state}
              options={locations}
              onChange={handleChange}
              placeholder="Select your location*"
              errorMessage="Select your location"
              // forceValidate={isSubmitting}
              required
            />
          </div>

          {/* Register Button */}

          <Button variant="success" type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm text-[#1F3E72] dark:text-gray-300">
            Already have an account?{" "}
            <Link to={paths.login} className="font-medium text-[#28B16D] hover:text-[#09C269]">
              Log in
            </Link>
          </div>
        </form>
      </div>
    );
  }
};

export default Register;
