import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import CompanyCard from "@pages/privatePages/companyPageSettings/CompanyCard";
import { toast } from "react-toastify";
import { companyCategory, NigerianStates } from "@utils/data";
import EnhancedInput from "@components/ui/EnhancedInput";
import EnhancedSelect from "@components/ui/EnhancedSelect";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterVerified, setFilterVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const limit = 8;

  const stateOptions = NigerianStates.map((state) => ({
    label: state.state,
    value: state.state,
  }));

  // Fetch companies from API
  const fetchCompanies = useCallback(
    async (pageNum, reset = false) => {
      try {
        setLoading(true);
        const res = await apiClient.get(endpoints.getAllCompanies, {
          params: {
            page: pageNum,
            limit,
            search,
            state: filterState,
            category: filterCategory,
            isVerified: filterVerified || undefined,
          },
        });

        const { data, pagination } = res.data.data;
        setCompanies((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(pagination.page < pagination.totalPages);
      } catch (error) {
        toast.error(ErrorFormatter(error));
      } finally {
        setLoading(false);
      }
    },
    [search, filterState, filterCategory, filterVerified] // 👈 include filter deps
  );

  // First load + whenever filters/search change
  useEffect(() => {
    setPage(1);
    fetchCompanies(1, true);
  }, [fetchCompanies]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) fetchCompanies(page);
  }, [page, fetchCompanies]);

  return (
    <div className=" section-container mx-auto bg-gray-100  flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar */}
      <div className="w-full lg:w-1/4  bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md self-start lg:sticky top-5 space-y-3 ">
        <h3 className="font-semibold text-lg mb-4 dark:text-gray-300 ">Search & Filters</h3>

        {/* Search */}
        <EnhancedInput
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          // className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        {/* Filter State */}

        <EnhancedSelect
          name="state"
          value={filterState}
          options={stateOptions}
          onChange={(e) => setFilterState(e.target.value)}
          placeholder="By States"
        />

        {/* Filter Category */}

        <EnhancedSelect
          name="state"
          value={filterCategory}
          options={companyCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          placeholder="By Categories"
        />

        {/* Filter Verified */}
        <label className="flex items-center gap-2 dark:text-gray-300 text-xs  ">
          <input
            type="checkbox"
            checked={filterVerified}
            onChange={(e) => setFilterVerified(e.target.checked)}
          />
          Verified Companies
        </label>
      </div>

      {/* Companies Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <CompanyCard companies={companies} />
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="w-full flex justify-center mt-6 lg:col-span-full">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading}
              className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
