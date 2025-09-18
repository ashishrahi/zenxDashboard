"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ICountry } from "@/types/countryTypes";

interface AddCountryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCountry: (country: ICountry) => void;
  countryToEdit?: ICountry;
}

export function AddCountryDialog({
  isOpen,
  onClose,
  onSubmitCountry,
  countryToEdit,
}: AddCountryDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<ICountry>({
    defaultValues: {
      name: "",
      code: "",
      continent: "",
      status: "active", // default status
    },
  });

  // Prefill form when editing
  useEffect(() => {
    if (countryToEdit) {
      setValue("name", countryToEdit.name);
      setValue("code", countryToEdit.code);
      setValue("continent", countryToEdit.continent);
      setValue("status", countryToEdit.status);
    } else {
      reset();
    }
  }, [countryToEdit, setValue, reset, isOpen]);

  const onSubmit = (data: ICountry) => {
    if (countryToEdit) data = { ...data, ...countryToEdit }; // preserve existing props if needed
    onSubmitCountry(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-primary">
        <DialogHeader>
          <DialogTitle>{countryToEdit ? "Edit Country" : "Add New Country"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          <Input
            {...register("name", { required: true })}
            placeholder="Country Name"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("code", { required: true })}
            placeholder="Country Code"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("continent", { required: true })}
            placeholder="Continent"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("status", { required: true })}
            placeholder="Status"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />

          <DialogFooter className="mt-2 flex justify-end gap-2">
            <Button variant="destructive" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{countryToEdit ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
