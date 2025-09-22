"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProductFilterProps {
  filterText: string;
  setFilterText: (val: string) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ filterText, setFilterText }) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          id="product-search"
          placeholder="Search by username..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};
