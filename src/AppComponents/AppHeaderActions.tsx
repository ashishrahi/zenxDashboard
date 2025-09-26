import React from "react";
import { Plus } from "lucide-react";
import { ProductFilter } from "@/AppComponents/ProductFilter";
import {AppButton} from '@/AppComponents/AppButton'

interface HeaderActionsProps {
  filterText: string;
  setFilterText: (value: string) => void;
  onAddClick?: () => void;
  title: string;
  searchText?:string;

}

const AppHeaderActions: React.FC<HeaderActionsProps> = ({
  filterText,
  setFilterText,
  onAddClick,
  title,
  searchText
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
      {/* Add Button */}
      <div className="w-full sm:w-auto">
        <AppButton
          onClick={onAddClick}
          className="flex items-center w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="mr-2 h-4 w-4" />
          {title}
        </AppButton>
      </div>

      {/* Filter */}
      <div className="w-full sm:w-1/3">
        <ProductFilter filterText={filterText} setFilterText={setFilterText} searchText = {searchText} />
      </div>
    </div>
  );
};

export default AppHeaderActions;
