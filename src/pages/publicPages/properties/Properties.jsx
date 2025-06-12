
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  forwardRef,
} from "react";
import { toast, ToastContainer } from "react-toastify";
import Breadcrumb from "./components/Breadcrumb";
import FeaturedProperties from "./components/sidebar/FeaturedProperties";
import RecentlyViewed from "./components/sidebar/RecentlyViewed";
import ContactAgent from "./components/sidebar/ContactAgent";
import PropertyCard from "@components/propertyCard/PropertyCard";
import SearchAndFilterBar from "./components/filters/SearchAndFilterBar";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { featuredProperties, recentlyViewed } from "@utils/data";
import { PuffLoader } from "react-spinners";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import MobileFootermenu from "./components/mobileFooterMenu/MobileFootermenu";
import convertFiltersToAPIFormat from "./components/filters/FilterToAPIFormat";

// Custom outer element to remove default scroll behavior
const CustomScrollContainer = forwardRef(({ children, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    style={{
      ...props.style,
      overflow: "visible",
    }}
  >
    {children}
  </div>
));

const Properties = () => {
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
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const listRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch properties
  const fetchProperties = useCallback(
    async (currentPage, isInitial) => {
      if (!hasMore && !isInitial) return;

      const isInitialLoad = isInitial ?? initialLoad;
      if (!isInitialLoad) {
        setIsFetchingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = convertFiltersToAPIFormat(filters, currentPage);
        const res = await apiClient.get(endpoints.fetchAllProperties, {
          params,
        });
        const newProperties = res.data.data.data;
        const pagination = res.data.data.pagination;
        
        setProperties((prev) => {
          if (isInitialLoad) return newProperties;
          const merged = [...prev, ...newProperties];
          return merged.filter(
            (property, index, self) =>
              index === self.findIndex((p) => p._id === property._id)
          );
        });

        setHasMore(pagination.page * pagination.limit < pagination.total);
        setInitialLoad(false);

        if (isInitialLoad && listRef.current) {
          listRef.current.scrollTo(0);
        }
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        } else {
          setIsFetchingMore(false);
        }
      }
    },
    [filters, hasMore, initialLoad]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
  }, [filters]);

  // Fetch properties when page or filters change
  useEffect(() => {
    const isInitial = page === 1;
    fetchProperties(page, isInitial);
  }, [page, filters, fetchProperties]);

  // Debounce search
  useEffect(() => {
    if (filters.searchTerm === undefined) return;

    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev }));
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Fixed item size based on mobile/desktop
  const getItemSize = useCallback(() => {
    // Card height + gap between cards
    return isMobile ? 522 : 612; // Adjust these values based on your actual card dimensions
  }, [isMobile]);

  // Handle scroll to load more
  const handleItemsRendered = useCallback(
    ({ visibleStopIndex }) => {
      if (
        visibleStopIndex >= properties.length - 2 &&
        hasMore &&
        !isFetchingMore
      ) {
        setPage((prev) => prev + 1);
      }
    },
    [properties.length, hasMore, isFetchingMore]
  );

  // Calculate list height based on fixed item sizes
  const listHeight = useMemo(() => {
    return properties.length * getItemSize();
  }, [properties.length, getItemSize]);

  // Virtualized list row component
  const PropertyRow = useCallback(
    ({ index, style }) => {
      const property = properties[index];
      return (
        <div style={{ ...style, paddingBottom: '16px' }}>
          <PropertyCard 
            property={property}
            className="h-full" // Ensure card fills its container
          />
        </div>
      );
    },
    [properties]
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumb />
      <ToastContainer />

      <section className="section-container">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <SearchAndFilterBar filters={filters} onFilterChange={setFilters} />

            {/* Virtualized Properties List */}
            {loading && properties.length === 0 ? (
              <div className="flex items-center justify-center py-8 w-full">
                <PuffLoader color="#3B82F6" size={60} />
              </div>
            ) : properties.length > 0 ? (
              <div className="properties-list-container">
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      ref={listRef}
                      height={listHeight}
                      width={width}
                      itemCount={properties.length}
                      itemSize={getItemSize()}
                      onItemsRendered={handleItemsRendered}
                      overscanCount={3}
                      outerElementType={CustomScrollContainer}
                    >
                      {PropertyRow}
                    </List>
                  )}
                </AutoSizer>

                {isFetchingMore && (
                  <div className="flex items-center justify-center py-4 border-t border-gray-200">
                    <PuffLoader color="#3B82F6" size={40} />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No properties found matching your criteria
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="relative w-full lg:w-1/3 hidden lg:flex">
            <div className="relative">
              <div className="w-full space-y-6 sticky top-0">
                <FeaturedProperties featuredProperties={featuredProperties} />
                <RecentlyViewed recentlyViewed={recentlyViewed} />
                <ContactAgent />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Footer Menu */}
      <MobileFootermenu />
    </div>
  );
};

export default Properties;
