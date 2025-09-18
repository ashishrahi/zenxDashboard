"use client";

import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { ProductFilter } from "@/AppComponents/ProductFilter";
import { Button } from "@/components/ui/button";
import { AddProductDialog } from "@/AppComponents/AddProductDialog"; // import dialog
import { Plus } from "lucide-react";

const productsData = [
  { id: 1, name: "Men's Briefs", size: "M", stock: 120, price: 499 },
  { id: 2, name: "Women's Bikini", size: "S", stock: 80, price: 399 },
];

const columns = [
  { key: "name", label: "Product Name" },
  { key: "size", label: "Size" },
  { key: "stock", label: "Stock" },
  { key: "price", label: "Price", render: (row: any) => `₹${row.price}` },
];

export default function ProductPage() {
  const [filterText, setFilterText] = useState("");
  const [products, setProducts] = useState(productsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (row: any) => console.log("Edit", row);
  const handleDelete = (row: any) =>
    setProducts(products.filter((p) => p.id !== row.id));

  const handleAddProduct = (product: any) => {
    setProducts([...products, { ...product, id: products.length + 1 }]);
    setIsDialogOpen(false);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-3 grid gap-6">
      <AppContainer title="Product List">
        <div className="flex justify-between mb-3">
          <ProductFilter filterText={filterText} setFilterText={setFilterText} />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <GlobalTable
          columns={columns}
          data={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </AppContainer>

      <AddProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
