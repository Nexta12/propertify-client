const Button = ({ children, type, onClick, variant = "primary", className }) => {
    const base = "inline-flex items-center justify-center  px-4 py-3 text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ";
  
    const variants = {
      primary: "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
      secondary: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500",
      success: "text-white bg-[#28B16D] hover:bg-[#09C269] focus:ring-green-500"
    };
    return (
      <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
        {children}
      </button>
    );
  };

  export default Button;