"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddProductDialog } from "@/AppComponents/AddProductDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";

import {
  useProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/Products/index";
import { Product } from "@/types/productTypes";

export default function ProductPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Filtering
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddDialog = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleSubmitProduct = (product: Product) => {
    if (product.id) {
      updateProduct.mutate(product);
    } else {
      addProduct.mutate({ ...product, id: undefined });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (product: Product) => {
    deleteProduct.mutate(product.id);
  };

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "size", label: "Size" },
    { key: "stock", label: "Stock" },
    {
      key: "price",
      label: "Price",
      render: (row: Product) => `₹${row.price}`,
    },
  ];

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        <AppHeaderActions
          title="Add Product"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={openAddDialog}
        />

        {/* Reusable Page Size Selector */}
        <PageSizeSelector
          pageSize={pageSize}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
        />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <GlobalTable
            columns={columns}
            data={paginatedProducts}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        )}

        <AddProductDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitProduct={handleSubmitProduct}
          productToEdit={selectedProduct || undefined}
        />

        <ShadCNPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </AppContainer>
  );
}
