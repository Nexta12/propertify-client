import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { Virtuoso } from "react-virtuoso";
import FeaturedProperties from "./components/sidebar/FeaturedProperties";
import RecentlyViewed from "./components/sidebar/RecentlyViewed";
import ContactAgent from "./components/sidebar/ContactAgent";
import SearchAndFilterBar from "./components/filters/SearchAndFilterBar";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { PuffLoader } from "react-spinners";
import convertFiltersToAPIFormat from "./components/filters/FilterToAPIFormat";
import PostCard from "@components/propertyCard/PostCard";
import MobileFootermenu from "./components/mobileFooterMenu/MobileFootermenu";
import MobileSearchBar from "./components/filters/MobileSearchBar";

const Properties = () => {
  // State declarations
  const [filters, setFilters] = useState({
    sortBy: "most_recent",
    propertyType: [],
    listingType: [],
    priceRange: [0, 100000000000000],
    bedrooms: [],
    bathrooms: [],
    verifiedOnly: false,
    location: [],
    searchTerm: "",
  });

  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handlePostDelete = (postId) => {
    setProperties((prev) => prev.filter((post) => post._id !== postId));
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch properties
  const fetchProperties = useCallback(
    async (currentPage, isInitial) => {
      if (!hasMore && !isInitial) return;

      setLoading(true);
      try {
        const params = convertFiltersToAPIFormat(filters, currentPage);
        const res = await apiClient.get(endpoints.fetchAllProperties, {
          params,
        });

        setProperties((prev) => {
          const newItems = res.data.data.data;
          return isInitial
            ? newItems
            : [...prev, ...newItems].filter(
                (p, i, self) =>
                  i === self.findIndex((item) => item._id === p._id)
              );
        });

        setHasMore(
          res.data.data.pagination.page * res.data.data.pagination.limit <
            res.data.data.pagination.total
        );
        setInitialLoad(false);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setLoading(false);
      }
    },
    [filters, hasMore]
  );

  // Reset on filter change
  useEffect(() => {
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
  }, [filters]);

  // Fetch data
  useEffect(() => {
    fetchProperties(page, page === 1);
  }, [page, filters, fetchProperties]);

  // Debounce search
  useEffect(() => {
    if (filters.searchTerm === undefined) return;
    const timer = setTimeout(() => setFilters((prev) => ({ ...prev })), 500);
    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  }, [loading, hasMore]);

  // Custom footer
  const CustomFooter = useCallback(() => {
    return (
      <div className="">
        {" "}
        {/* Added bottom padding */}
        {hasMore && loading && (
          <div className="flex justify-center p-4">
            <PuffLoader color="#3B82F6" size={40} />
          </div>
        )}
      </div>
    );
  }, [loading, hasMore]);

  return (
    <div className="bg-gray-50 min-h-screen ">
      {/* <Breadcrumb /> */}

      <main className="section-container !pt-2 flex items-start gap-x-4 relative ">
        {/* Left sidebar */}

        <div className="hidden lg:block w-1/4 sticky top-20 h-[calc(100vh-7rem)] overflow-y-auto pr-2 bg-white p-4">
          <SearchAndFilterBar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Main Post Content */}
        <div className="w-full lg:w-[calc(100%-512px)]  ">
       

          {initialLoad && properties.length === 0 ? (
            <div className="flex items-center justify-center py-8 w-full">
              <PuffLoader color="#3B82F6" size={60} />
            </div>
          ) : properties.length > 0 ? (
            <div ref={containerRef}>
              <Virtuoso
                data={properties}
                totalCount={properties.length}
                itemContent={(index) => (
                  <div className="mb-4">
                    <PostCard
                      post={properties[index]}
                       isProperty={properties[index].isProperty}
                      onDeleteSuccess={handlePostDelete}
                    />
                  </div>
                )}
                endReached={loadMore}
                overscan={isMobile ? 200 : 800}
                components={{ Footer: CustomFooter }}
                useWindowScroll
                style={{ overflow: "visible" }}
                scrollSeekConfiguration={{
                  enter: (velocity) => velocity > 1000,
                  exit: (velocity) => velocity < 100,
                }}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No properties found matching your criteria
            </div>
          )}
        </div>

        {/* Right sidebad */}
        <div className=" hidden lg:block w-1/4 sticky top-20 ">
          <div className="relative">
            <div className="w-full space-y-6 sticky top-0">
              <FeaturedProperties featuredProperties={properties} />
              <RecentlyViewed />
              <ContactAgent />
            </div>
          </div>
        </div>

      </main>

         {/* Mobile Seearch Bar Modal Display made re-usable, */}

        <MobileSearchBar showMobileSearch={showMobileSearch} setShowMobileSearch={setShowMobileSearch}>
            <SearchAndFilterBar
                filters={filters}
                onFilterChange={setFilters}
                onApplyFilters={() => setShowMobileSearch(false)}
              />
        </MobileSearchBar>

      <MobileFootermenu onSearchClick={() => setShowMobileSearch(true)} />
    </div>
  );
};

export default Properties;
