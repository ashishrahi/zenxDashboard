"use client";

import React from "react";
import { Search } from "lucide-react";

interface ProductFilterProps {
  filterText: string;
  setFilterText: (val: string) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ filterText, setFilterText }) => {
  return (
    <div className="mb-4 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground " size={18} />
      <input
        type="text"
        placeholder={`Search by username...`}
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="w-full pl-10 p-2 border rounded-md text-foreground dark:bg-background dark:text-foreground border-foreground dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
};
