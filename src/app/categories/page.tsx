"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddCategoryDialog } from "@/AppComponents/AppCategoryDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useCategories,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/Categories/index";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import { TableColumn } from "@/types/categoriesTypes";
export interface ICategoryPayload {
   _id: string;       // Required for database objects
  name: string;
  slug: string;
  description?: string;
  images: string[];  // Must match ICategoryPayload
  gender?: string;
  createdAt: string; // or Date if your API returns Date objects
  updatedAt: string; // or Date

}
export default function CategoryPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategoryPayload | null>(null);

  const { data: categories = [], isLoading } = useCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

 const filteredCategories = categories.filter((c) =>
  (c.name ?? "").toLowerCase().includes(filterText.toLowerCase())
);


  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Open Add Dialog
  const openAddDialog = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const openEditDialog = (category: ICategoryPayload) => {
    setSelectedCategory({
      ...category,
      _id: category._id || category._id,
    });
    setIsDialogOpen(true);
  };

  // Submit Category
const handleSubmitCategory = (category: ICategoryPayload) => {
  if (category._id) {
    // Update existing category
    updateCategory.mutate(category);
  } else {
    // Add new category
    addCategory.mutate(category);
  }
  setIsDialogOpen(false);
};



  // Delete Category
  const handleDelete = (category: ICategoryPayload) => deleteCategory.mutate(category._id);

  const columns: TableColumn<ICategoryPayload>[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  {
    key: "images",
    label: "Images",
    render: (row) => row.images?.length || "No images",
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    key: "updatedAt",
    label: "Updated At",
    render: (row) => new Date(row.updatedAt).toLocaleDateString(),
  },
];


  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        {/* Header Actions */}
        <AppHeaderActions
          title="Add Category"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={openAddDialog}
        />

        {/* Table */}
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
              data={paginatedCategories}
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

        {/* Add/Edit Dialog */}
        <AddCategoryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitCategory={handleSubmitCategory}
          categoryToEdit={selectedCategory || undefined}
        />
      </div>
    </AppContainer>
  );
}
