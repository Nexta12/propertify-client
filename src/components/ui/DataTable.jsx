import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

const DataTable = ({
  columns,
  data,
  enableSorting = true,
  enableSearch = true,
  tableTitle,
  addNewLink,
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : undefined,
      globalFilter: enableSearch ? globalFilter : undefined,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: enableSorting ? setSorting : undefined,
    onGlobalFilterChange: enableSearch ? setGlobalFilter : undefined,
    onPaginationChange: (updater) => {
      const newState = updater({
        pageIndex,
        pageSize,
      });
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    ...(enableSearch && { getFilteredRowModel: getFilteredRowModel() }),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="">
      {/* Global Search */}
      <div className="bg-white flex flex-col md:flex-row items-center md:items-center justify-between gap-4 p-4 md:p-6 rounded-t-xl w-full">
        {/* Title */}
        <h2 className="w-full md:w-auto text-center md:text-left text-xl font-semibold">
          {tableTitle}
        </h2>

        {/* Global Search */}
        {enableSearch && (
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8F5E9] focus:border-[#C8E6C9] transition-all duration-200"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        )}

        {/* Add New Button */}
        {addNewLink && (
          <Link
            to={addNewLink}
            className="w-full md:w-auto text-center px-4 py-2 bg-[#E8F5E9] text-primary-text font-medium rounded-lg hover:bg-[#d3edd4] transition-colors duration-200"
          >
            + Add New
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-[#E8F5E9]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={
                      enableSorting
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={`px-6 py-4 text-left font-bold text-primary-text uppercase tracking-wider ${
                      enableSorting ? "cursor-pointer select-none" : ""
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {enableSorting && (
                      <>
                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                          ? " 🔽"
                          : " ⬍"}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#f0fdf4] transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}

      {data.length > pageSize && (
        <div className="flex items-center justify-between mt-6 p-4">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-md bg-main-green text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 rounded-md bg-main-green text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>

          <span className="text-sm text-gray-600">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 rounded-md bg-[#E8F5E9] text-primary-text"
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
