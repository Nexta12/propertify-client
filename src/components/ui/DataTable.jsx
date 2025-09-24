import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import HandleGoBackBtn from "@components/goBackBtn/HandleGoBackBtn";
import { FiSearch } from "react-icons/fi";

const DataTable = ({
  columns,
  fetchData,
  enableSorting = true,
  enableSearch = true,
  tableTitle,
  addNewLink,
  addNewText,
}) => {
  const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const sortField = sorting[0]?.id || "createdAt";
        const sortOrder = sorting[0]?.desc ? "desc" : "asc";

        const response = await fetchData({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          sortField,
          sortOrder,
          search: globalFilter,
        });

        setData(response.data);
        setTotalCount(response.pagination?.total || 0);
      } catch (error) {
        console.error("Error loading table data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add debounce to search
    const timer = setTimeout(
      () => {
        loadData();
      },
      globalFilter ? 500 : 0
    );

    return () => clearTimeout(timer);
  }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, fetchData]);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      sorting: enableSorting ? sorting : undefined,
      globalFilter: enableSearch ? globalFilter : undefined,
      pagination,
    },
    onSortingChange: enableSorting ? setSorting : undefined,
    onGlobalFilterChange: enableSearch ? setGlobalFilter : undefined,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
  });

  return (
    <div className="mx-auto w-[calc(100vw-10px)] sm:w-[calc(100vw-100px)]  lg:w-[calc(100vw-420px)] ">
      <HandleGoBackBtn />
      {/* Global Search */}
      <div className="bg-white dark:bg-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 w-full relative mb-2 rounded-lg shadow-sm">
        {/* Title */}
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
          {tableTitle}
        </h2>

        {/* Right side: search + button */}
        <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
          {enableSearch && (
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 text-sm"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <FiSearch className="h-4 w-4" />
              </span>
            </div>
          )}

          {addNewLink && (
            <Link
              to={addNewLink}
              className="px-4 py-2 bg-main-green text-white font-medium rounded-lg hover:bg-green-hover transition-colors duration-200 text-sm whitespace-nowrap"
            >
              {addNewText || "+ Add New"}
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 shadow-sm rounded-t-lg">
        <table className="min-w-full text-sm bg-white dark:bg-gray-800">
          <thead className="border-b dark:border-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={enableSorting ? header.column.getToggleSortingHandler() : undefined}
                    className={`px-6 py-4 text-left text-[12px] font-bold text-primary-text dark:text-gray-300 uppercase tracking-wider whitespace-nowrap md:whitespace-normal ${
                      enableSorting ? "cursor-pointer select-none" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {enableSorting && (
                        <span className="ml-1">
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted()] ?? " ⬍"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-3 text-primary-text dark:text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center dark:text-gray-300">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalCount > pagination.pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 gap-4">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-md bg-main-green text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 rounded-md bg-main-green text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              Next
            </button>
          </div>

          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
            {" | "}
            <span>Total: {totalCount} items</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Rows per page:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  pageIndex: 0, // Reset to first page
                }));
              }}
              className="px-3 py-2 rounded-md bg-[#E8F5E9] dark:bg-gray-700 dark:text-white text-primary-text"
              disabled={isLoading}
            >
              {[5, 10, 20, 30, 40].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
