const MobileSearchBar = ({ showMobileSearch, setShowMobileSearch, children }) => {
  return (
    <>
      {showMobileSearch && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-950 overflow-y-hidden pt-4 px-4 pb-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-gray-200">Search Filters</h2>
            <button onClick={() => setShowMobileSearch(false)} className="text-gray-500 text-2xl">
              &times;
            </button>
          </div>

          {children}
        </div>
      )}
    </>
  );
};

export default MobileSearchBar;
