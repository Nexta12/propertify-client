import { useCallback, useEffect, useRef, useState } from "react";
import ProfessionalCard from "./ProfessionalCard";
import ProfessionalFilters from "./ProfessionalFilters";
import RightSidebar from "./ProfRightSidebar";
import { MiniTips } from "./PopularTags";
import MobileFootermenu from "../properties/components/mobileFooterMenu/MobileFootermenu";
import MobileSearchBar from "../properties/components/filters/MobileSearchBar";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { toast } from "react-toastify";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { Virtuoso } from "react-virtuoso";
import { PuffLoader } from "react-spinners";
import TipsCard from "@components/tips/TipsCard";
import { shufflePostsArray } from "@utils/helper";

const Professionals = () => {
  const [showProfessionalsSearch, setShowProfessionalsSearch] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: "",
    profession: "",
    state: "",
  });

  const [professionals, setProfessionals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch properties
  const fetchProfessionals = useCallback(
    async (currentPage, isInitial) => {
      if (!hasMore && !isInitial) return;

      setLoading(true);
      try {
        const params = {
          currentPage,
        };

        // if (filters.name) params.name = filters.name;
        if (filters.profession) params.profession = filters.profession;
        if (filters.state) params.state = filters.state;
        if (filters.searchTerm) params.searchTerm = filters.searchTerm;

        const res = await apiClient.get(endpoints.fetchAllProfessionals, { params });
        setProfessionals((prev) => {
          const newItems = res.data.data.data;
          return isInitial
            ? newItems
            : [...prev, ...newItems].filter(
                (p, i, self) => i === self.findIndex((item) => item._id === p._id)
              );
        });

        setHasMore(
          res.data.data.pagination.currentPage * res.data.data.pagination.limit <
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
    setProfessionals([]);
    setCurrentPage(1);
    setHasMore(true);
    setInitialLoad(true);
  }, [filters]);

  // Fetch data
  useEffect(() => {
    fetchProfessionals(currentPage, currentPage === 1);
  }, [currentPage, filters, fetchProfessionals]);

  // Debounce search
  useEffect(() => {
    if (filters.searchTerm === undefined) return;
    const timer = setTimeout(() => setFilters((prev) => ({ ...prev })), 2000);
    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (!loading && hasMore) setCurrentPage((prev) => prev + 1);
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

  // Shuffle posts Locally
  useEffect(() => {
    if (professionals.length === 0) return;

    const interval = setInterval(
      () => {
        setProfessionals((prev) => shufflePostsArray(prev));
      },
      5 * 60 * 1000
    ); // every 5 minutes

    return () => clearInterval(interval);
  }, [professionals.length]);

  return (
    <div className="bg-gray-100  dark:bg-gray-900 min-h-screen">
      {/* <Breadcrumb /> */}

      <main className="section-container !pt-2 flex items-start gap-x-4 relative">
        {/* Left sidebar */}
        <div className="hidden lg:block w-1/4 sticky top-20 h-[calc(100vh-7rem)] overflow-y-auto pr-2 bg-white dark:bg-gray-800 p-4 space-y-6">
          <ProfessionalFilters filters={filters} setFilters={setFilters} />
          {/* <PopularTags /> */}
          <TipsCard
            title={`👍 Search Tips`}
            tips={[
              "Use specific names to narrow results.",
              "Filter by state if you know the location.",
            ]}
          />
        </div>

        {/* Professionals Card */}
        <div className="w-full lg:w-[calc(100%-512px)] mb-16">
          {initialLoad && professionals.length === 0 ? (
            <div className="flex items-center justify-center py-8 w-full">
              <PuffLoader color="#3B82F6" size={60} />
            </div>
          ) : professionals.length > 0 ? (
            <div ref={containerRef}>
              <Virtuoso
                data={professionals}
                totalCount={professionals.length}
                itemContent={(index) => (
                  <div className="mb-4">
                    <ProfessionalCard key={index} user={professionals[index]} />
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
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No properties found matching your criteria
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block w-1/4 sticky top-20">
          <div className="relative">
            <div className="w-full space-y-6 sticky top-0">
              <RightSidebar />
            </div>
          </div>
        </div>
      </main>

      <MobileSearchBar
        showMobileSearch={showProfessionalsSearch}
        setShowMobileSearch={setShowProfessionalsSearch}
      >
        <ProfessionalFilters
          filters={filters}
          setFilters={setFilters}
          hideModal={setShowProfessionalsSearch}
        />
        <div className="mt-6">
          <MiniTips />
        </div>
      </MobileSearchBar>

      <MobileFootermenu onSearchClick={() => setShowProfessionalsSearch(true)} />
    </div>
  );
};

export default Professionals;
