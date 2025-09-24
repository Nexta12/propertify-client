import { cn } from "@utils/classNames";

const HeaderTitle = ({ titleText, className }) => {
  return (
    <h1
      className={cn(
        "text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100",
        className
      )}
    >
      {titleText}
    </h1>
  );
};

export default HeaderTitle;
