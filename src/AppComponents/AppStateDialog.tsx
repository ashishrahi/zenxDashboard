"use client";

import { useEffect, useCallback, useRef } from "react";
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
import { Tag, XCircle, Loader2 } from "lucide-react";
import { AppButton } from "./AppButton";
import { IStatePayload, AddStateDialogProps } from "@/types/IStateTypes";
import { useCountries } from "@/hooks/Countries";

export function AddStateDialog({
  isOpen,
  onClose,
  stateToEdit,
  onSubmit,
  isLoading = false,
}: AddStateDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { data: countries = [] } = useCountries();

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    formState: { errors, isValid } 
  } = useForm<IStatePayload>({
    defaultValues: {
      _id: stateToEdit?._id || "",
      name: stateToEdit?.name || "",
      code: stateToEdit?.code || "",
      countryId: stateToEdit?.countryId || "",
    },
    mode: "onChange",
  });

  const resetForm = useCallback(() => {
    reset({
      _id: "",
      name: "",
      code: "",
      countryId: "",
    });
  }, [reset]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    if (stateToEdit) {
      setValue("_id", stateToEdit._id || "");
      setValue("name", stateToEdit.name || "");
      setValue("code", stateToEdit.code || "");
      setValue("countryId", stateToEdit.countryId || "");
    } else {
      resetForm();
    }

    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  }, [isOpen, stateToEdit, setValue, resetForm]);

  const handleFormSubmit = (data: IStatePayload) => {
    // Ensure _id is preserved when editing
    if (stateToEdit?._id) {
      data._id = stateToEdit._id;
    }
    onSubmit(data);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-[var(--card)] dark:bg-[var(--card)] rounded-xl shadow-2xl border border-[var(--border)] dark:border-[var(--border)] max-h-[80vh] overflow-y-auto scrollbar-hide animate__animated animate__fadeIn">
        <DialogHeader className="pb-4 border-b border-[var(--border)] dark:border-[var(--border)] sticky top-0 bg-[var(--card)] dark:bg-[var(--card)] z-10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-[var(--foreground)] dark:text-[var(--foreground)]">
            <Tag size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
            {stateToEdit ? "Edit State" : "Add New State"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 gap-4 py-4 px-1">
          {/* State Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]">
              State Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., Maharashtra"
              {...register("name", { 
                required: "State name is required", 
                minLength: { value: 2, message: "State name must be at least 2 characters" } 
              })}
              ref={(e) => { register("name").ref(e); nameInputRef.current = e; }}
              className="placeholder:text-[var(--muted-foreground)] dark:placeholder:text-[var(--muted-foreground)] text-[var(--foreground)] dark:text-[var(--foreground)] bg-[var(--input)] dark:bg-[var(--input)] border-[var(--border)] dark:border-[var(--border)]"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* State Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]">
              State Code *
            </Label>
            <Input
              id="code"
              placeholder="e.g., MH"
              {...register("code", { 
                required: "State code is required", 
                minLength: { value: 2, message: "State code must be at least 2 characters" }, 
                maxLength: { value: 5, message: "State code must be less than 5 characters" } 
              })}
              className="placeholder:text-[var(--muted-foreground)] dark:placeholder:text-[var(--muted-foreground)] text-[var(--foreground)] dark:text-[var(--foreground)] bg-[var(--input)] dark:bg-[var(--input)] border-[var(--border)] dark:border-[var(--border)]"
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
          </div>

          {/* Country Select */}
          <div className="space-y-2">
            <Label htmlFor="countryId" className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]">
              Country *
            </Label>
            <select
              id="countryId"
              {...register("countryId", { required: "Country is required" })}
              className="placeholder:text-[var(--muted-foreground)] dark:placeholder:text-[var(--muted-foreground)] text-[var(--foreground)] dark:text-[var(--foreground)] bg-[var(--input)] dark:bg-[var(--input)] border-[var(--border)] dark:border-[var(--border)] w-full h-10 rounded-md px-3"
            >
              <option value="" disabled>Select a country</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>{country.name}</option>
              ))}
            </select>
            {errors.countryId && <p className="text-red-500 text-xs mt-1">{errors.countryId.message}</p>}
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-4 flex justify-end gap-3 border-t border-[var(--border)] dark:border-[var(--border)] pt-4 sticky bottom-0 bg-[var(--card)] dark:bg-[var(--card)] z-10">
            <AppButton variant="outline" type="button" onClick={handleClose} disabled={isLoading} className="bg-destructive">
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton type="submit" disabled={isLoading || !isValid}>
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : stateToEdit ? "Update State" : "Add State"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
