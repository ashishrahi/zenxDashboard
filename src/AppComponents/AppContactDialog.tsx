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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppButton } from "./AppButton";
import { XCircle, Edit3 } from "lucide-react";
import { IContact } from "@/types/IContactTypes";


interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitContact: (contact: IContact) => void;
  contactToEdit?: IContact;
}

export function AddContactDialog({
  isOpen,
  onClose,
  onSubmitContact,
  contactToEdit,
}: AddContactDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IContact>({
    defaultValues: {
      _id: "",
      title: "",
      address: "",
      cin: "",
      email: "",
      phone: "",
      timing: "",
      colspan: 1,
    },
  });

  useEffect(() => {
    if (contactToEdit) {
      setValue("_id", contactToEdit._id ?? "");
      setValue("title", contactToEdit.title ?? "");
      setValue("address", contactToEdit.address ?? "");
      setValue("cin", contactToEdit.cin ?? "");
      setValue("email", contactToEdit.email ?? "");
      setValue("phone", contactToEdit.phone ?? "");
      setValue("timing", contactToEdit.timing ?? "");
      setValue("colspan", contactToEdit.colspan ?? 1);
    } else {
      reset();
    }
  }, [contactToEdit, setValue, reset, isOpen]);

  const onSubmit = (data: IContact) => {
    onSubmitContact(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {contactToEdit ? (
              <>
                <Edit3 size={20} className="text-blue-500" /> Edit Contact
              </>
            ) : (
              <>Add New Contact</>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 py-4">
          <input type="hidden" {...register("_id")} />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter title"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Enter address"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition h-20 resize-none"
            />
          </div>

          {/* CIN */}
          <div className="space-y-2">
            <Label htmlFor="cin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              CIN
            </Label>
            <Input
              id="cin"
              {...register("cin")}
              placeholder="Enter CIN"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              {...register("email")}
              placeholder="Enter email"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Enter phone"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Timing */}
          <div className="space-y-2">
            <Label htmlFor="timing" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Timing
            </Label>
            <Input
              id="timing"
              {...register("timing")}
              placeholder="Enter timing"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Colspan */}
          <div className="space-y-2">
            <Label htmlFor="colspan" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Colspan
            </Label>
            <Input
              id="colspan"
              type="number"
              {...register("colspan")}
              placeholder="Enter colspan"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 pt-4 sticky bottom-0 bg-white dark:bg-gray-900 z-10">
            <AppButton
              variant="outline"
              type="button"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              {contactToEdit ? "Update Contact" : "Add Contact"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
