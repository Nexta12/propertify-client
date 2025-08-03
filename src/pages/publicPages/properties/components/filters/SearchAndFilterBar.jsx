
import CollapsableBox from "@pages/privatePages/dashboard/components/CollapsableBox";
import { NigerianStates, PropertyTypes } from "@utils/data";
import {  FiSearch } from "react-icons/fi";

const SearchAndFilterBar = ({ filters, onFilterChange, onApplyFilters  }) => {


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

  const listingTypes = [
    "For Sale",
    "For Rent",
    "Shortlet",
    "Lease",
    "Mortgage",
  ];

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
    <div className="h-full flex flex-col">
     
      {/* Search Bar - Always visible */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search properties..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition placeholder:text-neutral-400"
          value={filters.searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Filter Section - Always visible on desktop, toggleable on mobile */}
      <div className={`lg:block space-y-6 overflow-y-auto flex-1`}>
        {/* Quick Filters */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 text-[13px] ">Quick Filters</h3>
          
          {/* Listing Type */}
          <div>
           
            <div className="flex flex-wrap gap-2">
              {listingTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleFilter("listingType", type)}
                  className={`px-3 py-1 text-[13px] rounded-full transition capitalize ${
                    filters.listingType.includes(type)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
           
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">
              By Type
            </label>
            <div className="flex flex-wrap gap-2">
              {[...new Set(PropertyTypes.map((type) => type.category))].map(
                (category, index) => (
                  <button
                    key={index}
                    onClick={() => toggleFilter("propertyType", category)}
                    className={`px-3 py-1 text-[13px] rounded-full transition capitalize ${
                      filters.propertyType.includes(category)
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Location */}
           <CollapsableBox className="!p-0  !shadow-none !border-none pr-1 !text-[13px]" title="By States"  >
          <div>
            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
              By States
            </label> */}
            <div className="flex flex-wrap gap-2">
              {NigerianStates.map((item, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter("location", item.state)}
                  className={`px-3 py-1 text-[13px] rounded-full transition capitalize ${
                    filters.location.includes(item.state)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {item.state}
                </button>
              ))}
            </div>
          </div>
          </CollapsableBox>
        </div>

        {/* Advanced Filters */}
        <CollapsableBox className="!p-0  !shadow-none !border-none pr-1 " title="Advanced" >
        <div className="space-y-6 pt-4 border-t border-gray-200">
          {/* <h3 className="font-medium text-gray-700">Advanced Filters</h3> */}

          {/* Sort By */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 "
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map((option) => (
                <option className="" key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px] text-gray-600">
                <span>₦{filters.priceRange[0].toLocaleString()}</span>
                <span>₦{filters.priceRange[1].toLocaleString()}</span>
              </div>
              <div className="space-y-2">
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
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => toggleFilter("bedrooms", num)}
                  className={`px-3 py-1 text-[13px] rounded-full transition ${
                    filters.bedrooms.includes(num)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <div className="flex flex-wrap gap-2">
              {bathroomOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => toggleFilter("bathrooms", num)}
                  className={`px-3 py-1 text-[13px] rounded-full transition ${
                    filters.bathrooms.includes(num)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
        </CollapsableBox>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={clearFilters}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Clear All
          </button>
          <button
            onClick={onApplyFilters}
            className="lg:hidden flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
