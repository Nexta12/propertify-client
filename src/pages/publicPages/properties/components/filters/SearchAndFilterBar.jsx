
import { NigerianStates, PropertyTypes } from "@utils/data";
import React, { useEffect, useState } from "react";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";

const SearchAndFilterBar = ({ filters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

    const [sticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 w-full z-10 sticky top-12 lg:top-16">
      <div className="flex flex-col sm:flex-row gap-4 items-center">

        <div className="relative flex-1 w-full ">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, location, type, etc..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition placeholder:text-neutral-400"
            value={filters.searchTerm}
            onChange={handleSearch}
          />
        </div>
       
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full sm:w-auto justify-center"
        >
          <FiFilter />
          <span>More Filters</span>
          {showFilters && <FiX />}
        </button>

      </div>

      {/* Quick filters */}
    
      <div className={`my-4 space-y-4 max-w-[700px] ${sticky ? "hidden" : "flex flex-col"}`}>
        {/* Listing Type */}
        <span className="text-center text-xs italic">Smart Fllters</span>
        <div className="flex gap-3">
          <label className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[80px] ">
            By Purpose
          </label>
          <div className="flex-3 flex  overflow-x-auto  gap-2" style={{ scrollbarWidth: "none" }} >
            {listingTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleFilter("listingType", type)}
                className={`px-3 py-1 text-sm rounded-full transition capitalize whitespace-nowrap ${
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
        <div className="flex gap-3">
          <label className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[80px] ">
            By Type
          </label>
          <div className=" flex-3 flex  overflow-x-auto  gap-2" style={{ scrollbarWidth: "none" }} >
            {[...new Set(PropertyTypes.map((type) => type.category))].map(
              (category, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter("propertyType", category)}
                  className={`px-3 py-1 text-sm rounded-full transition capitalize whitespace-nowrap ${
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
        {/* By Location */}
        <div className="flex gap-3">
          <label className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[80px]">
            By States
          </label>
          <div className="flex-3 flex  overflow-x-auto  gap-2" style={{ scrollbarWidth: "none" }}>
            {NigerianStates.map((item, index) => (
              <button
                key={index}
                onClick={() => toggleFilter("location", item.state)}
                className={`px-3 py-1 text-sm rounded-full transition capitalize whitespace-nowrap ${ filters.location.includes(item.state)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"} `}
              >
                {item.state}
              </button>
            ))}
          </div>
        </div>
      </div>
 

      {/* Expanded Filters */}
      <div
        className={`fixed inset-0 bg-white z-50 overflow-y-auto p-4 transition-all duration-300 lg:static lg:bg-gray-50 lg:rounded-lg lg:mt-4 lg:p-6 ${
          showFilters ? "block" : "hidden"
        }`}
      >
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: &#x20A6;{filters.priceRange[0].toLocaleString()} -
              &#x20A6;
              {filters.priceRange[1].toLocaleString()}
            </label>
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

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => toggleFilter("bedrooms", num)}
                  className={`px-3 py-1 text-sm rounded-full transition ${
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <div className="flex flex-wrap gap-2">
              {bathroomOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => toggleFilter("bathrooms", num)}
                  className={`px-3 py-1 text-sm rounded-full transition ${
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

        <div className="mt-6 flex gap-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
