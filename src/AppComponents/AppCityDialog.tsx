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
import { ICityPayload, AddCityDialogProps } from "@/types/ICityPayload";
import { useStates } from "@/hooks/States";

export function AddCityDialog({
  isOpen,
  onClose,
  cityToEdit,
  onSubmit,
  isLoading = false,
}: AddCityDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { data: states = [] } = useStates();

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    formState: { errors, isValid } 
  } = useForm<ICityPayload>({
    defaultValues: {
      _id: cityToEdit?._id || "",
      name: cityToEdit?.name || "",
      code: cityToEdit?.code || "",
      stateId: cityToEdit?.stateId || "",
    },
    mode: "onChange",
  });

  const resetForm = useCallback(() => {
    reset({
      _id: "",
      name: "",
      code: "",
      stateId: "",
    });
  }, [reset]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    if (cityToEdit) {
      setValue("_id", cityToEdit._id || "");
      setValue("name", cityToEdit.name || "");
      setValue("code", cityToEdit.code || "");
      setValue("stateId", cityToEdit.stateId || "");
    } else {
      resetForm();
    }

    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  }, [isOpen, cityToEdit, setValue, resetForm]);

  const handleFormSubmit = (data: ICityPayload) => {
    if (cityToEdit?._id) {
      data._id = cityToEdit._id;
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
            {cityToEdit ? "Edit City" : "Add New City"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 gap-4 py-4 px-1">
          {/* City Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]">
              City Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., Mumbai"
              {...register("name", { 
                required: "City name is required", 
                minLength: { value: 2, message: "City name must be at least 2 characters" } 
              })}
              ref={(e) => { register("name").ref(e); nameInputRef.current = e; }}
              className="placeholder:text-[var(--muted-foreground)] dark:placeholder:text-[var(--muted-foreground)] text-[var(--foreground)] dark:text-[var(--foreground)] bg-[var(--input)] dark:bg-[var(--input)] border-[var(--border)] dark:border-[var(--border)]"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* City Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]">
              City Code *
            </Label>
            <Input
              id="code"
              placeholder="e.g., BOM"
              {...register("code", { 
                required: "City code is required", 
                minLength: { value: 2, message: "City code must be at least 2 characters" }, 
                maxLength: { value: 5, message: "City code must be less than 5 characters" } 
              })}
              className="placeholder:text-[var(--muted-foreground)] dark:placeholder:text-[var(--muted-foreground)] text-[var(--foreground)] dark:text-[var(--foreground)] bg-[var(--input)] dark:bg-[var(--input)] border-[var(--border)] dark:border-[var(--border)]"
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
          </div>

          {/* State Select */}
          <div className="space-y-2">
            <Label htmlFor="stateId" className="text-sm font-medium text-[var(--foreground)] dark:text-[var(--foreground)]">
              State *
            </Label>
            <select
              id="stateId"
              {...register("stateId", { required: "State is required" })}
              className="placeholder:text-[var(--muted-foreground)] dark:placeholder:text-[var(--muted-foreground)] text-[var(--foreground)] dark:text-[var(--foreground)] bg-[var(--input)] dark:bg-[var(--input)] border-[var(--border)] dark:border-[var(--border)] w-full h-10 rounded-md px-3"
            >
              <option value="" disabled>Select a state</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>{state.name}</option>
              ))}
            </select>
            {errors.stateId && <p className="text-red-500 text-xs mt-1">{errors.stateId.message}</p>}
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-4 flex justify-end gap-3 border-t border-[var(--border)] dark:border-[var(--border)] pt-4 sticky bottom-0 bg-[var(--card)] dark:bg-[var(--card)] z-10">
            <AppButton variant="outline" type="button" onClick={handleClose} disabled={isLoading} className="bg-destructive">
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton type="submit" disabled={isLoading || !isValid}>
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : cityToEdit ? "Update City" : "Add City"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
