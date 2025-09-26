"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProductFilterProps {
  filterText: string;
  setFilterText: (val: string) => void;
  searchText?:string
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ filterText, setFilterText, searchText }) => {
  return (
    <div className="mb-4">
      <div className="relative">
  <Search 
    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" 
    size={18} 
  />
  <Input
    id="product-search"
    placeholder={`Search by ${searchText}...`}
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
    className="
      pl-10 
      bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]
      dark:bg-[var(--input)] dark:text-[var(--foreground)] dark:border-[var(--border)]
      placeholder:text-[var(--muted-foreground)] dark:placeholder:text-[var(--muted-foreground)]
    "
  />
</div>

    </div>
  );
};
