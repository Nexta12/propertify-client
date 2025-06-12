const convertFiltersToAPIFormat = (filters, currentPage) => {
  return {
    sort:
      filters.sortBy === "most_recent"
        ? "latest"
        : filters.sortBy === "highest_price"
        ? "price-high"
        : filters.sortBy === "lowest_price"
        ? "price-low"
        : "latest",
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    beds: filters.bedrooms.length ? filters.bedrooms.join(",") : undefined,
    baths: filters.bathrooms.length ? filters.bathrooms.join(",") : undefined,
    propertyType: filters.propertyType.length
      ? filters.propertyType.join(",")
      : undefined,
    purpose: filters.listingType.length
      ? filters.listingType.join(",")
      : undefined,
    location: filters.location.length
      ? filters.location.join(",")
      : undefined,
    search: filters.searchTerm,
    page: currentPage,
    limit: 10,
  };
};

export default convertFiltersToAPIFormat;