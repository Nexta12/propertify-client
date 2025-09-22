const PopularSearches = ({
  tags = [],
  onTagClick,
  className = "",
  title = "🔥 Popular Searches",
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm ${className}`}>
      <h3 className="font-semibold text-primary-text dark:text-gray-100 mb-2 text-sm">{title}</h3>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => onTagClick && onTagClick(tag)}
            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearches;
