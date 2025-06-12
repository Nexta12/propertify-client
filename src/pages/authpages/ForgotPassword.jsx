import { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { paths } from "@routes/paths";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">

        {/* Logo Section */}
        <div className="mt-5 text-center">
          <div className="flex justify-center">
            <Link to={paths.index}>
              <img src="./green-logo.png" alt="" width={140} />
            </Link>
          </div>

          <h2 className="text-xl font-semibold text-[#122947] mt-2">
            {isSubmitted ? 'Check your email' : 'Forgot your password?'}
          </h2>
          <p className="text-[#8E9395] text-sm mt-1">
            {isSubmitted 
              ? 'We sent password reset instructions to your email'
              : 'Enter your email to reset your password'}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1F3E72] mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-[#8E9395]" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#28B16D] focus:border-transparent text-sm font-medium text-gray-800"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#28B16D] hover:bg-[#09C269] text-white font-semibold rounded-lg transition-colors"
            >
              Reset Password
            </button>

            {/* Back to Login Link */}
            <div className="text-center text-sm text-[#1F3E72]">
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
            <p className="text-[#1F3E72] mb-5">
              If an account exists for <span className="font-medium">{email}</span>, you'll receive an email with reset instructions.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 border border-[#28B16D] text-[#28B16D] hover:bg-[#E8F5E9] font-semibold rounded-lg transition-colors"
            >
              Resend Email
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ForgotPassword;