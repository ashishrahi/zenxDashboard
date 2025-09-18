"use client";
import React from "react";

interface PageSizeSelectorProps {
  pageSize: number;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  pageSize,
  setPageSize,
  setCurrentPage,
}) => {
  return (
    <div className="flex justify-end items-center gap-2 p-2 bg-secondary rounded-md shadow-sm">
      <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
        Rows per page:
      </label>
      <select
        id="pageSize"
        className="border border-gray-400 rounded-md px-2 py-1 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
          setCurrentPage(1); // Reset to first page whenever page size changes
        }}
      >
        {[5, 10, 20, 50].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};
