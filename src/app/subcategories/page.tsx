"use client";

import { useState, useMemo } from "react";
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
import { useCategories } from "@/hooks/Categories";

export interface ISubcategoryPayload {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  categoryId: string;
}

export default function SubcategoryPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<ISubcategory | null>(null);

  const { data: subcategories = [], isLoading } = useSubcategories();
  const { data: categories = [] } = useCategories();

  const addSubcategory = useAddSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();

  // Keep subcategories as-is, no parentCategoryId
  const filteredSubcategories = useMemo(() => {
    return subcategories.filter(c =>
      (c.name ?? "").toLowerCase().includes(filterText.toLowerCase())
    );
  }, [subcategories, filterText]);

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
    const sub = subcategories.find(s => s._id === subcategory._id);
    setSelectedSubcategory(sub ?? null);
    setIsDialogOpen(true);
  };

  const handleSubmitSubcategory = (subcategory: ISubcategoryPayload) => {
    if (subcategory._id) {
      updateSubcategory.mutate(subcategory);
    } else {
      addSubcategory.mutate(subcategory);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (subcategory: ISubcategory) => {
    if (!subcategory._id) return;
    deleteSubcategory.mutate(subcategory._id);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    {
      key: "images",
      label: "Images",
      render: (row: ISubcategory) => (row.images?.length ?? 0) || "No images",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row: ISubcategory) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
    },
    {
      key: "updatedAt",
      label: "Updated At",
      render: (row: ISubcategory) =>
        row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "N/A",
    },
  ];

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        <AppHeaderActions
          title="Add Subcategory"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={openAddDialog}
        />

        <div
          className={`border rounded-md transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-2 gap-2 sm:gap-0">
          <PageSizeSelector pageSize={pageSize} setPageSize={setPageSize} setCurrentPage={setCurrentPage} />
          <ShadCNPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>

        <AddSubcategoryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitSubcategory={handleSubmitSubcategory}
          subcategoryToEdit={
            selectedSubcategory
              ? {
                  _id: selectedSubcategory._id,
                  name: selectedSubcategory.name || "",
                  slug: selectedSubcategory.slug || "",
                  description: selectedSubcategory.description || "",
                  images: selectedSubcategory.images || [],
                  categoryId: selectedSubcategory.categoryId || "",
                }
              : undefined
          }
          categories={categories}
        />
      </div>
    </AppContainer>
  );
}
