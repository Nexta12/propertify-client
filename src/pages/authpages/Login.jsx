import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@routes/paths";
import EnhancedInput from "@components/ui/EnhancedInput";
import { toast } from "react-toastify";
import useAuthStore from "@store/authStore";
import Button from "@components/ui/Button";
import { getLoggedInUserPath } from "@utils/helper";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import GreenLogo from "@assets/img/green-logo.png"
import FullPageLoader from "./FullPageLoader";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const {
    login,
    isLoading,
    setError,
    user,
    isAuthenticated,
    validateAuth,
  } = useAuthStore();

  const [authLoading, setAuthLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(null);
  };

    const validateForm = () => {
   
      if (!formData.email || !formData.password ) {
        toast.error("Please fill all required fields");
        return false;
      }
  
      return true;
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

   await login(formData, navigate);

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

  if(!isAuthenticated){
  return (
  
           
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative">
         <div className="absolute top-4 left-5">
        <HandleGoBackBtn/>
        </div>
        {/* Logo Section */}
        <div className="mt-5 text-center">
          <div className="flex justify-center">
            <Link to={paths.index}>
              <img src={GreenLogo} alt="" width={140} />
            </Link>
          </div>
          <p className="text-[#8E9395] text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email Field */}

          <div className="relative">
            <EnhancedInput
              type="email"
              label="Email Address"
              id="email"
              name="email"
              value={formData.email}
              forceValidate={isLoading}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <EnhancedInput
                label="Password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                forceValidate={isLoading}
                errorMessage="Please Enter Your password"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="text-right mt-1">
              <Link
                to={paths.forgotPassword}
                className="text-xs text-[#28B16D] hover:text-[#09C269]"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Login Button */}

          <Button
            variant="success"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "  Signing In..." : "Sign In"}
          </Button>

          {/* Register Link */}
          <div className="text-center text-sm text-[#1F3E72] dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to={paths.register}
              className="font-medium text-[#28B16D] hover:text-[#09C269]"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
 
  );
    }
};

export default Login;
