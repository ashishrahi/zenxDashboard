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
import { Switch } from "@/components/ui/switch";
import { IGenderPayload, AddGenderDialogProps } from "@/types/IGenderPayload";

export function AddGenderDialog({
  isOpen,
  onClose,
  genderToEdit,
  onSubmit,
  isLoading = false,
}: AddGenderDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<IGenderPayload>({
    defaultValues: { name: "", status: true },
    mode: "onChange",
  });

  // Reset form to default values
  const resetForm = useCallback(() => {
    reset({ name: "", status: true });
  }, [reset]);

  // When dialog opens or closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    if (genderToEdit) {
      setValue("name", genderToEdit.name || "");
      setValue("status", genderToEdit.status ?? true);
    } else {
      resetForm();
    }

    // Auto-focus on gender name input when dialog opens
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  }, [isOpen, genderToEdit, setValue, resetForm]);

  // Handle form submit
  const handleFormSubmit = (data: IGenderPayload) => {
    onSubmit(data);
  };

  // Handle dialog close
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
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-[var(--border)] dark:border-[var(--border)] sticky top-0 bg-[var(--card)] dark:bg-[var(--card)] z-10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-[var(--foreground)] dark:text-[var(--foreground)]">
            <Tag
              size={20}
              className="text-[var(--primary)] dark:text-[var(--primary)]"
            />
            {genderToEdit ? "Edit Gender" : "Add New Gender"}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-cols-1 gap-4 py-4 px-1"
        >
          {/* Gender Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]"
            >
              Gender Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., Male, Female, Other"
              {...register("name", {
                required: "Gender name is required",
                minLength: {
                  value: 2,
                  message: "Gender name must be at least 2 characters",
                },
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
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Status Switch */}
          <div className="flex items-center justify-between space-y-2">
            <Label
              htmlFor="status"
              className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]"
            >
              Status
            </Label>
            <Switch
              id="status"
              defaultChecked={genderToEdit?.status ?? true}
              onCheckedChange={(checked) => setValue("status", checked)}
            />
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
            <AppButton type="submit" disabled={isLoading || !isValid}>
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : genderToEdit ? (
                "Update Gender"
              ) : (
                "Add Gender"
              )}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
