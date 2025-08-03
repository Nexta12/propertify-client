import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import PostCard from "@components/propertyCard/PostCard";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import convertFiltersToAPIFormat from "@pages/publicPages/properties/components/filters/FilterToAPIFormat";
import MobileSearchBar from "@pages/publicPages/properties/components/filters/MobileSearchBar";
import SearchAndFilterBar from "@pages/publicPages/properties/components/filters/SearchAndFilterBar";
import MobileFootermenu from "@pages/publicPages/properties/components/mobileFooterMenu/MobileFootermenu";
import FeaturedProperties from "@pages/publicPages/properties/components/sidebar/FeaturedProperties";
import RecentlyViewed from "@pages/publicPages/properties/components/sidebar/RecentlyViewed";
import { useCallback, useEffect, useRef, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Virtuoso } from "react-virtuoso";

const Feed = () => {
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
    <section className="flex relative w-full">
      {/* Main Container */}
      <div className="flex-[2] lg:mr-4">
        <div>
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
      </div>
      {/* Right Sidebar */}
      <div className="hidden lg:block flex-1 space-y-5 self-start sticky top-0">
        <FeaturedProperties featuredProperties={properties} />
        <RecentlyViewed />
        {/* <ContactAgent /> */}
      </div>

      {/* Mobile Seearch Bar Modal Display made re-usable, */}

      <MobileSearchBar
        showMobileSearch={showMobileSearch}
        setShowMobileSearch={setShowMobileSearch}
      >
        <SearchAndFilterBar
          filters={filters}
          onFilterChange={setFilters}
          onApplyFilters={() => setShowMobileSearch(false)}
        />
      </MobileSearchBar>

      <MobileFootermenu onSearchClick={() => setShowMobileSearch(true)} />
    </section>
  );
};

export default Feed;
