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
import { ICountryPayload, AddCountryDialogProps } from "@/types/ICountryTypes";

export function AddCountryDialog({
  isOpen,
  onClose,
  countryToEdit,
  onSubmit,
  isLoading = false,
}: AddCountryDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    formState: { errors, isValid } 
  } = useForm<ICountryPayload>({
    defaultValues: { name: "", code: "" },
    mode: "onChange",
  });

  const resetForm = useCallback(() => {
    reset({ name: "", code: "" });
  }, [reset]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    if (countryToEdit) {
      setValue("name", countryToEdit.name || "");
      setValue("code", countryToEdit.code || "");
    } else {
      resetForm();
    }

    // Auto-focus on country name when dialog opens
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  }, [isOpen, countryToEdit, setValue, resetForm]);

  const handleFormSubmit = (data: ICountryPayload) => {
    onSubmit(data);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="
          sm:max-w-lg 
          bg-[var(--card)] dark:bg-[var(--card)] 
          rounded-xl shadow-2xl border border-[var(--border)] dark:border-[var(--border)] 
          max-h-[80vh] overflow-y-auto scrollbar-hide
          animate__animated animate__fadeIn
        "
      >
        <DialogHeader className="pb-4 border-b border-[var(--border)] dark:border-[var(--border)] sticky top-0 bg-[var(--card)] dark:bg-[var(--card)] z-10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-[var(--foreground)] dark:text-[var(--foreground)]">
            <Tag size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
            {countryToEdit ? "Edit Country" : "Add New Country"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 gap-4 py-4 px-1">
          {/* Country Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]">
              Country Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., India"
              {...register("name", { 
                required: "Country name is required",
                minLength: { value: 2, message: "Country name must be at least 2 characters" }
              })}
              ref={(e) => {
                register("name").ref(e);
                nameInputRef.current = e;
              }}
              className="
                placeholder:text-[var(--muted-foreground)]
                dark:placeholder:text-[var(--muted-foreground)]
                text-[var(--foreground)] dark:text-[var(--foreground)]
                bg-[var(--input)] dark:bg-[var(--input)]
                border-[var(--border)] dark:border-[var(--border)]
              "
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Country Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]">
              Country Code *
            </Label>
            <Input
              id="code"
              placeholder="e.g., IN"
              {...register("code", { 
                required: "Country code is required",
                minLength: { value: 2, message: "Country code must be at least 2 characters" },
                maxLength: { value: 5, message: "Country code must be less than 5 characters" }
              })}
              className="
                placeholder:text-[var(--muted-foreground)]
                dark:placeholder:text-[var(--muted-foreground)]
                text-[var(--foreground)] dark:text-[var(--foreground)]
                bg-[var(--input)] dark:bg-[var(--input)]
                border-[var(--border)] dark:border-[var(--border)]
              "
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-4 flex justify-end gap-3 border-t border-[var(--border)] dark:border-[var(--border)] pt-4 sticky bottom-0 bg-[var(--card)] dark:bg-[var(--card)] z-10">
            <AppButton 
              variant="outline" 
              type="button" 
              onClick={handleClose} 
              disabled={isLoading}
              className="bg-destructive"
            >
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton 
              type="submit" 
              disabled={isLoading || !isValid}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : countryToEdit ? (
                "Update Country"
              ) : (
                "Add Country"
              )}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
