"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: { name: string; size: string; stock: number; price: number }) => void;
}

export function AddProductDialog({ isOpen, onClose, onAddProduct }: AddProductDialogProps) {
  const [product, setProduct] = useState({
    name: "",
    size: "",
    stock: 0,
    price: 0,
  });

  const handleAdd = () => {
    if (!product.name || !product.size) return; // Basic validation
    onAddProduct(product);
    setProduct({ name: "", size: "", stock: 0, price: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Input
            type="text"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Input
            type="text"
            placeholder="Size"
            value={product.size}
            onChange={(e) => setProduct({ ...product, size: e.target.value })}
            className="text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Input
            type="number"
            placeholder="Stock"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
            className="text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Input
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            className="text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
