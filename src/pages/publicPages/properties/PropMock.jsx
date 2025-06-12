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
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import MobileFootermenu from "./components/mobileFooterMenu/MobileFootermenu";

// Custom outer element to remove default scroll behavior
const CustomScrollContainer = forwardRef(({ children, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    style={{
      ...props.style,
      overflow: "visible", // Disable react-window's own scrollbar
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
    priceRange: [0, 10000000],
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
  const sizeMap = useRef({}); // Cache for item heights
  const isMobile = window.innerWidth <= 913; // Simple mobile detection; consider react-device-detect for more robustness

  // Convert filters to API format
  const convertFiltersToAPIFormat = useCallback((filters, currentPage) => {
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

        // Reset height cache and list on filter changes
        if (isInitialLoad) {
          sizeMap.current = {};
          if (listRef.current) {
            listRef.current.resetAfterIndex(0);
            listRef.current.scrollTo(0);
          }
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
    [filters, hasMore, initialLoad, convertFiltersToAPIFormat]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    sizeMap.current = {}; // Clear height cache
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
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

  // Estimate item height based on device and content
  const getItemSize = useCallback(
    (index) => {
      const property = properties[index];
      if (!property) return isMobile ? 550 : 300; // Fallback heights

      // Check cache first
      if (sizeMap.current[index]) {
        return sizeMap.current[index];
      }

      // Estimate height based on content (e.g., number of images, description length)
      let baseHeight = isMobile ? 550 : 300; // Base height for mobile/desktop
      const hasMedia = property.images?.length > 0 || property.video; // Example media check
      const descriptionLength = property.description?.length || 0;

      if (hasMedia) {
        baseHeight += isMobile ? 100 : 150; // Add extra height for media
      }
      if (descriptionLength > 200) {
        baseHeight += isMobile ? 50 : 100; // Add height for longer descriptions
      }

      // Cache the calculated height
      sizeMap.current[index] = baseHeight;
      return baseHeight;
    },
    [properties, isMobile]
  );

  // Handle window resize to update heights
  useEffect(() => {
    const handleResize = () => {
      sizeMap.current = {}; // Clear cache on resize
      if (listRef.current) {
        listRef.current.resetAfterIndex(0); // Recalculate heights
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Virtualized list row component
  const PropertyRow = useCallback(
    ({ index, style }) => {
      const property = properties[index];
      return (
        <div style={style} className="">
          <PropertyCard
            className="!shadow-none"
            property={property}
            onLoad={() => {
              // Measure actual height after rendering
              const element = document.getElementById(
                `property-card-${property._id}`
              );
              if (element) {
                const actualHeight = element.getBoundingClientRect().height;
                if (actualHeight !== sizeMap.current[index]) {
                  sizeMap.current[index] = actualHeight;
                  if (listRef.current) {
                    listRef.current.resetAfterIndex(index); // Update list with actual height
                  }
                }
              }
            }}
          />
        </div>
      );
    },
    [properties]
  );

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

  // Calculate dynamic list height
  const listHeight = useMemo(() => {
    return properties.reduce(
      (total, _, index) => total + getItemSize(index),
      0
    );
  }, [properties, getItemSize]);

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
              <div className=" flex items-center justify-center py-8 w-full">
                <PuffLoader color="#3B82F6" size={60} />
              </div>
            ) : properties.length > 0 ? (
              <div className="">
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      ref={listRef}
                      height={listHeight} // Dynamic height based on content
                      width={width}
                      itemCount={properties.length}
                      itemSize={getItemSize} // Dynamic height function
                      onItemsRendered={handleItemsRendered}
                      overscanCount={3}
                      outerElementType={CustomScrollContainer} // Use custom container
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
            <div className="w-full space-y-6 sticky top-0">
              <FeaturedProperties featuredProperties={featuredProperties} />
              <RecentlyViewed recentlyViewed={recentlyViewed} />
              <ContactAgent />
            </div>
          </div>
        </div>
      </section>

       {/* Mobile Footer Menu */}
       <MobileFootermenu/>
    </div>
  );
};

export default Properties;
