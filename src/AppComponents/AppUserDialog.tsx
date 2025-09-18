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
import { IUser} from "@/types/userTypes";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitUser: (user: IUser) => void;
  userToEdit?: IUser; 
}

export function AddUserDialog({
  isOpen,
  onClose,
  onSubmitUser,
  userToEdit,
}: AddUserDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<IUser>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        zipcode: "",
      },
    },
  });

  // Prefill form when editing
  useEffect(() => {
    if (userToEdit) {
      setValue("name", userToEdit.name);
      setValue("username", userToEdit.username);
      setValue("email", userToEdit.email);
      setValue("phone", userToEdit.phone);
      setValue("address.street", userToEdit.address.street);
      setValue("address.city", userToEdit.address.city);
      setValue("address.zipcode", userToEdit.address.zipcode);
    } else {
      reset();
    }
  }, [userToEdit, setValue, reset, isOpen]);

  const onSubmit = (data: IUser) => {
    if (userToEdit) data = { ...data, ...userToEdit }; // preserve any existing properties if needed
    onSubmitUser(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-primary">
        <DialogHeader>
          <DialogTitle>{userToEdit ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          <Input
            {...register("name", { required: true })}
            placeholder="Name"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("username", { required: true })}
            placeholder="Username"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("email", { required: true })}
            placeholder="Email"
            type="email"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("phone", { required: true })}
            placeholder="Phone"
            type="tel"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("address.street", { required: true })}
            placeholder="Street"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("address.city", { required: true })}
            placeholder="City"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("address.zipcode", { required: true })}
            placeholder="Zipcode"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />

          <DialogFooter className="mt-2 flex justify-end gap-2">
            <Button variant="destructive" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{userToEdit ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
