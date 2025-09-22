"use client";

import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { Column, GlobalTable } from "@/AppComponents/AppTable";
import { AddProductDialog } from "@/AppComponents/AddProductDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/Products";

import { IProductPayload } from "@/types/productTypes";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import { useCategories } from "@/hooks/Categories";

export default function ProductPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProductPayload | null>(null);

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Filter products by name or slug
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Open Add Dialog
  const openAddDialog = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const openEditDialog = (product: IProductPayload) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  // Submit Product
  const handleSubmitProduct = (product: IProductPayload) => {
    if (product._id) {
      updateProduct.mutate(product);
    } else {
      addProduct.mutate(product);
    }
    setIsDialogOpen(false);
  };

  // Delete Product
  const handleDelete = (product: IProductPayload) => {
    deleteProduct.mutate(product._id);
  };

  // Columns with safe optional chaining
  const columns: Column<IProductPayload>[] = [
    { key: "name", label: "Product Name" },
    { key: "slug", label: "Slug" },
    {
      key: "price",
      label: "Price",
      render: (row) => `₹${row.price ?? 0}`,
    },
    {
      key: "colors",
      label: "Colors",
      render: (row) => (row.colors?.length ? row.colors.join(", ") : "N/A"),
    },
    {
      key: "sizes",
      label: "Sizes",
      render: (row) => (row.sizes?.length ? row.sizes.join(", ") : "N/A"),
    },
    {
      key: "variants",
      label: "Variants",
      render: (row) => row.variants?.length ?? 0,
    },
    {
      key: "stock",
      label: "Total Stock",
      render: (row) => row.stock ?? 0,
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => row.rating ?? "N/A",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
    },
  ];

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        {/* Header Actions */}
        <AppHeaderActions
          title="Add Product"
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
            <GlobalTable<IProductPayload>
              columns={columns}
              data={paginatedProducts}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              title="Products"
            />
          )}
        </div>

        {/* Pagination & Page Size */}
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

        {/* Add / Edit Product Dialog */}
        <AddProductDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitProduct={handleSubmitProduct}
          productToEdit={selectedProduct || undefined}
          categories={categories}
        />
      </div>
    </AppContainer>
  );
}
