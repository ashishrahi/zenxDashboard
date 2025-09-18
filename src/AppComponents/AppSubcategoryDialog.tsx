"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddSubcategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSubcategory: (subcategory: { name: string; description: string; mainCategory: string; status: string }) => void;
  subcategoryToEdit?: { name: string; description: string; mainCategory: string; status: string };
  categories?: string[]; // optional list of main categories
}

export function AddSubcategoryDialog({
  isOpen,
  onClose,
  onSubmitSubcategory,
  subcategoryToEdit,
  categories = [],
}: AddSubcategoryDialogProps) {
  const [subcategory, setSubcategory] = useState({
    name: subcategoryToEdit?.name || "",
    description: subcategoryToEdit?.description || "",
    mainCategory: subcategoryToEdit?.mainCategory || "",
    status: subcategoryToEdit?.status || "Active",
  });

  const handleSubmit = () => {
    if (!subcategory.name || !subcategory.mainCategory) return; // Basic validation
    onSubmitSubcategory(subcategory);
    setSubcategory({ name: "", description: "", mainCategory: "", status: "Active" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>{subcategoryToEdit ? "Edit Subcategory" : "Add Subcategory"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Input
            type="text"
            placeholder="Subcategory Name"
            value={subcategory.name}
            onChange={(e) => setSubcategory({ ...subcategory, name: e.target.value })}
            className="text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Input
            type="text"
            placeholder="Description"
            value={subcategory.description}
            onChange={(e) => setSubcategory({ ...subcategory, description: e.target.value })}
            className="text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Select
            value={subcategory.mainCategory}
            onValueChange={(val) => setSubcategory({ ...subcategory, mainCategory: val })}
          >
            <SelectTrigger className="text-black dark:text-white">
              <SelectValue placeholder="Select Main Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={subcategory.status}
            onValueChange={(val) => setSubcategory({ ...subcategory, status: val })}
          >
            <SelectTrigger className="text-black dark:text-white">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{subcategoryToEdit ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
