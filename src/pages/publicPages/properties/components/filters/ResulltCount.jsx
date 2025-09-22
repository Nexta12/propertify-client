const ResultCount = ({ properties, resultCount }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-gray-700">
        {resultCount.toLocaleString()} Properties Found
      </h2>
      <div className="text-sm text-gray-500">
        Showing {Math.min(properties.length, resultCount)} of {resultCount.toLocaleString()}
      </div>
    </div>
  );
};

export default ResultCount;
