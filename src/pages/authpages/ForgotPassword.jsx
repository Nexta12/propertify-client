import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { paths } from "@routes/paths";
import HandleGoBackBtn from '@components/goBackBtn/HandleGoBackBtn';
import GreenLogo from "@assets/img/green-logo.png"
import EnhancedInput from '@components/ui/EnhancedInput';
import { toast } from 'react-toastify';
import { ErrorFormatter } from '@pages/errorPages/ErrorFormatter';
import { apiClient } from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { removeLocalStorageItem, setLocalStorageItem } from '@utils/localStorage';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
     try {
        setLoading(true)
       const response = await apiClient.post(endpoints.ForgetPassword, {email})
           if (response.status == 200) {
                setLocalStorageItem('otpEmail', email);
                setLocalStorageItem('resetEmail', email);
                setLocalStorageItem('otp', true);
                 setTimeout(() => {
                   navigate(paths.verifyOTP);
                 }, 3000);
             }
       setIsSubmitted(true);
     } catch (error) {
      toast.error(ErrorFormatter(error))
      removeLocalStorageItem('userEmail', email);
      removeLocalStorageItem('resetEmail', email);
      removeLocalStorageItem('showOtpPage', true);
     }finally{
      setLoading(false)
     }
   
  };

  return (
  

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative ">
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

          <h2 className="text-xl font-semibold text-[#122947] dark:text-gray-300 mt-2">
            {isSubmitted ? 'Check your email' : ''}
          </h2>
          <p className="text-[#8E9395] text-sm mt-1 dark:text-gray-300">
            {isSubmitted 
              ? 'We sent password reset instructions to your email'
              : ''}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Email Field */}
                 <div className="relative">
            <EnhancedInput
              type="email"
              label="Email Address"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#28B16D] hover:bg-[#09C269] text-white font-semibold rounded-lg transition-colors"
            >
             {loading ? 'Please Wait...' : "Reset Password"} 
            </button>

            {/* Back to Login Link */}
            <div className="text-center text-sm text-[#1F3E72] dark:text-gray-300">
              Remember your password?{' '}
              <Link
                to={paths.login}
                className="font-medium text-[#28B16D] hover:text-[#09C269]"
              >
                Sign in
              </Link>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center">
            <div className="mb-5">
              <svg className="w-16 h-16 text-[#28B16D] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p className="text-[#1F3E72] mb-5 dark:text-gray-300 ">
              If an account exists for <span className="font-medium">{email}</span>, you'll receive an email with reset instructions.
            </p>
            
          </div>
        )}
      </div>
      
  
  );
};

export default ForgotPassword;