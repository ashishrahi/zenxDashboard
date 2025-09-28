"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppButton } from "./AppButton";
import { XCircle, Edit3 } from "lucide-react";
import { IExport } from "@/types/IExportItem";
import { useCountries } from "@/hooks/Countries";

interface AddExportItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitItem: (item: Omit<IExport, "_id"> & { _id?: string }) => void;
  itemToEdit?: IExport;
}

export function AddExportItemDialog({
  isOpen,
  onClose,
  onSubmitItem,
  itemToEdit,
}: AddExportItemDialogProps) {
  const { data: countries = [] } = useCountries();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IExport>({
    defaultValues: {
      // Remove _id from default values for new items
      countryId: "",
      code: "",
      volume: "",
      category: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (itemToEdit) {
      // Only set _id when editing an existing item
      setValue("_id", itemToEdit._id);
      setValue("countryId", itemToEdit.countryId ?? "");
      setValue("code", itemToEdit.code ?? "");
      setValue("volume", itemToEdit.volume ?? "");
      setValue("category", itemToEdit.category ?? "");
      setValue("isActive", itemToEdit.isActive ?? true);
    } else {
      // Clear form for new items (without _id)
      reset({
        countryId: "",
        code: "",
        volume: "",
        category: "",
        isActive: true,
      });
    }
  }, [itemToEdit, setValue, reset, isOpen]);

  const onSubmit = (data: IExport) => {
  // For new items, ensure _id is undefined, for edits keep the _id
  const submitData = {
    ...data,
    _id: itemToEdit ? data._id : undefined
  };
  
  onSubmitItem(submitData);
  reset();
  onClose();
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {itemToEdit ? (
              <>
                <Edit3 size={20} className="text-blue-500" /> Edit Export Item
              </>
            ) : (
              <>Add Export Item</>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 py-4">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="countryId" className="text-gray-700 dark:text-gray-200">
              Country
            </Label>
            <select
              id="countryId"
              {...register("countryId", { required: "Country is required" })}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.countryId && (
              <p className="text-red-500 text-xs">{errors.countryId.message}</p>
            )}
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-gray-700 dark:text-gray-200">
              Code
            </Label>
            <Input
              id="code"
              {...register("code", { required: "Code is required" })}
              placeholder="Enter code"
              className="text-gray-900 dark:text-gray-100"
            />
            {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <Label htmlFor="volume" className="text-gray-700 dark:text-gray-200">
              Volume
            </Label>
            <Input
              id="volume"
              {...register("volume")}
              placeholder="Enter volume"
              className="text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-700 dark:text-gray-200">
              Category
            </Label>
            <Input
              id="category"
              {...register("category")}
              placeholder="Enter category"
              className="text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* IsActive - Fixed checkbox styling */}
          <div className="space-y-2 flex items-center gap-2">
            <input 
              id="isActive" 
              type="checkbox" 
              {...register("isActive")} 
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <Label htmlFor="isActive" className="text-gray-700 dark:text-gray-200 cursor-pointer">
              Active
            </Label>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 pt-4 sticky bottom-0 bg-white dark:bg-gray-900 z-10">
            <AppButton variant="outline" type="button" onClick={onClose}>
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton type="submit" className="bg-blue-600 hover:bg-blue-700">
              {itemToEdit ? "Update Export Item" : "Add Export Item"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}