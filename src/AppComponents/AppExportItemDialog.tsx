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
import Image from "next/image";

export interface IExportItem {
  _id?: string;
  country: string;
  code: string;
  flag?: string | File;
  volume: string;
  category: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AddExportItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitItem: (item: IExportItem) => void;
  itemToEdit?: IExportItem;
}

export function AddExportItemDialog({
  isOpen,
  onClose,
  onSubmitItem,
  itemToEdit,
}: AddExportItemDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IExportItem>({
    defaultValues: {
      _id: "",
      country: "",
      code: "",
      flag: undefined,
      volume: "",
      category: "",
      isActive: true,
    },
  });

  const flagValue = watch("flag");

  useEffect(() => {
    if (itemToEdit) {
      setValue("_id", itemToEdit._id ?? "");
      setValue("country", itemToEdit.country ?? "");
      setValue("code", itemToEdit.code ?? "");
      setValue("flag", itemToEdit.flag ?? undefined);
      setValue("volume", itemToEdit.volume ?? "");
      setValue("category", itemToEdit.category ?? "");
      setValue("isActive", itemToEdit.isActive ?? true);
    } else {
      reset();
    }
  }, [itemToEdit, setValue, reset, isOpen]);

  const onSubmit = (data: IExportItem) => {
    onSubmitItem(data);
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
          <input type="hidden" {...register("_id")} />

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              {...register("country", { required: "Country is required" })}
              placeholder="Enter country"
            />
            {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              {...register("code", { required: "Code is required" })}
              placeholder="Enter code"
            />
            {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
          </div>

          {/* Flag */}
          <div className="space-y-2">
            <Label htmlFor="flag">Flag</Label>
            <Input
              id="flag"
              type="file"
              accept="image/*"
              {...register("flag")}
            />
            {flagValue && typeof flagValue !== "string" && (
              <Image
                width={200}
                height={200}
                src={URL.createObjectURL(flagValue as File)}
                alt="Flag preview"
                className="w-16 h-10 mt-2 object-cover rounded"
              />
            )}
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <Label htmlFor="volume">Volume</Label>
            <Input id="volume" {...register("volume")} placeholder="Enter volume" />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register("category")} placeholder="Enter category" />
          </div>

          {/* IsActive */}
          <div className="space-y-2">
            <Label htmlFor="isActive">Active</Label>
            <Input id="isActive" type="checkbox" {...register("isActive")} />
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
