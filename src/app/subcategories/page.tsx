"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddSubcategoryDialog } from "@/AppComponents/AppSubcategoryDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useSubcategories,
  useAddSubcategory,
  useUpdateSubcategory,
  useDeleteSubcategory,
} from "@/hooks/Subcategories/index";
import { ISubcategory } from "@/types/subcategoryTypes";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";

export default function SubcategoryPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<ISubcategory | null>(null);

  const { data: subcategories = [], isLoading } = useSubcategories();
  const addSubcategory = useAddSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();

  const filteredSubcategories = subcategories.filter((s) =>
    s.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubcategories.length / pageSize);
  const paginatedSubcategories = filteredSubcategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddDialog = () => {
    setSelectedSubcategory(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (subcategory: ISubcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDialogOpen(true);
  };

  const handleSubmitSubcategory = (subcategory: ISubcategory) => {
    if (subcategory.id) updateSubcategory.mutate(subcategory);
    else addSubcategory.mutate({ ...subcategory, id: undefined });
    setIsDialogOpen(false);
  };

  const handleDelete = (subcategory: ISubcategory) => deleteSubcategory.mutate(subcategory.id!);

  const columns = [
    { key: "name", label: "Subcategory Name" },
    { key: "description", label: "Description" },
    { key: "categoryId", label: "Parent Category" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        {/* Header Actions */}
        <AppHeaderActions
          title="Add Subcategory"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={openAddDialog}
        />

        {/* Table Container */}
        <div
          className={`border rounded-md transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${
            pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"
          }`}
        >
          {isLoading ? (
            <TableSkeleton rows={pageSize} />
          ) : (
            <GlobalTable
              columns={columns}
              data={paginatedSubcategories}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-2 gap-2 sm:gap-0">
          <PageSizeSelector
            pageSize={pageSize}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
          />

          <ShadCNPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Add / Edit Subcategory Dialog */}
        <AddSubcategoryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitSubcategory={handleSubmitSubcategory}
          subcategoryToEdit={selectedSubcategory || undefined}
        />
      </div>
    </AppContainer>
  );
}
