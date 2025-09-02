const QuickNote = ({
  children,
  className = "",
  bgColor = "bg-bg-green dark:bg-gray-800",
}) => {
  return (
    <div
      className={`p-4 rounded-md text-sm text-primary-text dark:text-gray-100 ${bgColor} ${className}`}
    >
      {children}
    </div>
  );
};

export default QuickNote;
