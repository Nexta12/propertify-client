const HeaderTitle = ({ titleText }) => {
  return (
    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
      {titleText}
    </h1>
  );
};

export default HeaderTitle;
