import { NigerianStates, professions } from "@utils/data";

const ProfessionalFilters = ({ filters, setFilters, hideModal }) => {
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setFilters({ searchTerm: "", profession: "", state: "" });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm text-sm space-y-4">
      <h2 className="text-lg font-semibold text-primary-text dark:text-white mb-4">
        Search & Filter
      </h2>

      {/* Keyword Search */}
      <div className="space-y-1">
        <input
          type="text"
          name="searchTerm"
          id="search"
          placeholder="Search by name or anything..."
          value={filters.searchTerm}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:placeholder:text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main-green"
        />
      </div>

      {/* Profession Filter */}
      <div className="space-y-1">
        <select
          name="profession"
          id="profession"
          value={filters.profession}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main-green"
        >
          <option value="">All Professions</option>
          {professions.map((profession, i) => (
            <option key={i} value={profession.value}>
              {profession.label}
            </option>
          ))}
        </select>
      </div>

      {/* State Filter */}
      <div className="space-y-1">
        <label htmlFor="state" className="text-primary-text dark:text-white font-medium">
          Location (State)
        </label>
        <select
          name="state"
          id="state"
          value={filters.state}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main-green"
        >
          <option value="">All States</option>
          {NigerianStates.map((state, i) => (
            <option key={i} value={state.state}>
              {state.state}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={handleReset} className="block text-xs text-orange underline mt-2">
          Reset Filters
        </button>

        <button
          onClick={() => hideModal()}
          className="block lg:hidden text-xs text-primary-text dark:text-white underline mt-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProfessionalFilters;
