const TipsCard = ({
  title = "💡 Tips for Property Seekers",
  tips = [
    "Always verify property documents.",
    "Visit properties before making payment.",
    "Use trusted agents or platforms.",
  ],
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
      <h3 className="font-semibold text-primary-text dark:text-gray-100 mb-2 text-sm">
        {title}
      </h3>
      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default TipsCard;
