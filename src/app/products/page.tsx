"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddProductDialog } from "@/AppComponents/AddProductDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/Products";

import { IProduct } from "@/types/productTypes";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import { useCategories } from "@/hooks/Categories";

export interface IProductPayload {
  _id?: string;
  name: string;
  slug: string;
  price: number;
  colors: string[];
  variants: {
    color: string;
    images: string[];
    stock: number;
  }[];
  sizes: string[];
  category: string;
  subCategory: string;
  description?: string;
  material?: string;
  care?: string;
  delivery?: string;
  rating?: number;
  stock: number;
}

export default function ProductPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Filter products by name or slug
  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddDialog = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: IProduct) => {
    setSelectedProduct({ ...product, _id: product._id });
    setIsDialogOpen(true);
  };

  const handleSubmitProduct = (product: IProductPayload) => {
    if (product._id) {
      updateProduct.mutate(product);
    } else {
      addProduct.mutate(product);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (product: IProduct) => deleteProduct.mutate(product._id);

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "slug", label: "Slug" },
    {
      key: "price",
      label: "Price",
      render: (row: IProduct) => `₹${row.price}`,
    },
    {
      key: "colors",
      label: "Colors",
      render: (row: IProduct) => row.colors.join(", "),
    },
    {
      key: "sizes",
      label: "Sizes",
      render: (row: IProduct) => row.sizes.join(", "),
    },
    {
      key: "variants",
      label: "Variants",
      render: (row: IProduct) => row?.variants?.length,
    },
    {
      key: "stock",
      label: "Total Stock",
      render: (row: IProduct) => row.stock,
    },
    {
      key: "rating",
      label: "Rating",
      render: (row: IProduct) => row.rating ?? "N/A",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row: IProduct) =>
        new Date(row.createdAt).toLocaleDateString(),
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
            <GlobalTable
              columns={columns}
              data={paginatedProducts}
              onEdit={openEditDialog}
              onDelete={handleDelete}
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
