

import CollapsableBox from "@pages/privatePages/dashboard/components/CollapsableBox";
import { NigerianStates, PropertyTypes } from "@utils/data";
import { FiSearch } from "react-icons/fi";

const SearchAndFilterBar = ({ filters, onFilterChange, onApplyFilters, isRequired = true, className }) => {
  const toggleFilter = (filterKey, value) => {
    onFilterChange((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(value)
        ? prev[filterKey].filter((t) => t !== value)
        : [...prev[filterKey], value],
    }));
  };

  const handleSearch = (e) => {
    onFilterChange((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
  };

  const handlePriceChange = (index, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
    onFilterChange((prev) => ({
      ...prev,
      priceRange: newPriceRange,
    }));
  };

  const handleSortChange = (e) => {
    onFilterChange((prev) => ({
      ...prev,
      sortBy: e.target.value,
    }));
  };

  const clearFilters = () => {
    onFilterChange({
      sortBy: "most_recent",
      propertyType: [],
      listingType: [],
      priceRange: [0, 10000000000000],
      bedrooms: [],
      bathrooms: [],
      verifiedOnly: false,
      location: [],
      searchTerm: "",
    });
  };

  const listingTypes = ["For Sale", "For Rent", "Shortlet", "Lease", "Mortgage"];
  const bedroomOptions = [1, 2, 3, 4, 5, "5+"];
  const bathroomOptions = [1, 2, 3, 4, "4+"];
  const sortOptions = [
    { value: "most_recent", label: "Most Recent" },
    { value: "highest_price", label: "Highest Price" },
    { value: "lowest_price", label: "Lowest Price" },
    { value: "largest_area", label: "Largest Area" },
    { value: "smallest_area", label: "Smallest Area" },
    { value: "most_bedrooms", label: "Most Bedrooms" },
    { value: "verified", label: "Verified Only" },
  ];



  return (

    <div className={` bg-white dark:bg-gray-900  shadow-sm text-sm space-y-4 lg:flex flex-col h-full overflow-y-auto sticky top-20 p-4 ${className}  `}>
  {/* Search Input */}
  <div className="relative">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary dark:text-gray-400" />
    <input
      type="text"
      placeholder="Search properties..."
      value={filters.searchTerm}
      onChange={handleSearch}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none   placeholder:text-secondary dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
    />
  </div>

  {isRequired && (
    <>
      {/* Quick Filters */}
      <div className="space-y-3">
        <div className="space-y-2">
          <h3 className="text-[13px] text-primary-text dark:text-white font-semibold">Listing Type</h3>
          <div className="flex flex-wrap gap-2">
            {listingTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleFilter("listingType", type)}
                className={`px-3 py-1 text-[13px] rounded-full transition capitalize ${
                  filters.listingType.includes(type)
                    ? "bg-main-green text-white"
                    : "bg-gray-100 text-secondary hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-primary-text dark:text-white">Property Type</label>
          <div className="flex flex-wrap gap-2">
            {[...new Set(PropertyTypes.map((type) => type.category))].map((category, index) => (
              <button
                key={index}
                onClick={() => toggleFilter("propertyType", category)}
                className={`px-3 py-1 text-[13px] rounded-full transition capitalize ${
                  filters.propertyType.includes(category)
                    ? "bg-main-green text-white"
                    : "bg-gray-100 text-secondary hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <CollapsableBox title="By States" className="!p-0 !shadow-none !border-none pr-1 !text-[13px]">
          <div className="flex flex-wrap gap-2 pt-2 max-h-[100px] overflow-y-auto">
            {NigerianStates.map((item, index) => (
              <button
                key={index}
                onClick={() => toggleFilter("location", item.state)}
                className={`px-3 py-1 text-[13px] rounded-full transition capitalize ${
                  filters.location.includes(item.state)
                    ? "bg-main-green text-white"
                    : "bg-gray-100 text-secondary hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {item.state}
              </button>
            ))}
          </div>
        </CollapsableBox>
      </div>

      {/* Advanced Filters */}
      <CollapsableBox title="Advanced" className="!p-0 !shadow-none !border-none pr-1">
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4 max-h-[100px] overflow-y-auto">
          {/* Sort By */}
          <div>
            <label className="block text-[13px] font-medium text-primary-text dark:text-white mb-2">Sort By</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-green dark:bg-gray-800 dark:text-white"
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[13px] font-medium text-primary-text dark:text-white mb-2">Price Range</label>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px] text-secondary dark:text-gray-300">
                <span>₦{filters.priceRange[0].toLocaleString()}</span>
                <span>₦{filters.priceRange[1].toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000000"
                step="100000"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="10000000"
                step="100000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-[13px] font-medium text-primary-text dark:text-white mb-2">Bedrooms</label>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => toggleFilter("bedrooms", num)}
                  className={`px-3 py-1 text-[13px] rounded-full transition ${
                    filters.bedrooms.includes(num)
                      ? "bg-main-green text-white"
                      : "bg-gray-100 text-secondary hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-[13px] font-medium text-primary-text dark:text-white mb-2">Bathrooms</label>
            <div className="flex flex-wrap gap-2">
              {bathroomOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => toggleFilter("bathrooms", num)}
                  className={`px-3 py-1 text-[13px] rounded-full transition ${
                    filters.bathrooms.includes(num)
                      ? "bg-main-green text-white"
                      : "bg-gray-100 text-secondary hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CollapsableBox>

      {/* Footer Actions */}
      <div className="flex gap-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={clearFilters}
          className="flex-1 px-4 py-2 bg-gray-100 text-secondary dark:bg-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          Clear All
        </button>
        <button
          onClick={onApplyFilters}
          className="lg:hidden flex-1 px-4 py-2 bg-main-green text-white rounded-lg hover:bg-green-hover transition"
        >
          Apply
        </button>
      </div>
    </>
  )}
  
    </div>

  );
};

export default SearchAndFilterBar;

