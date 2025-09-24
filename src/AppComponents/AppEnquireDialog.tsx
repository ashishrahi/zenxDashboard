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
import { IEnquire } from "@/types/IEnquireTypes";

interface AddEnquireDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEnquire: (enquire: IEnquire) => void;
  enquireToEdit?: IEnquire;
}

export function AddEnquireDialog({
  isOpen,
  onClose,
  onSubmitEnquire,
  enquireToEdit,
}: AddEnquireDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IEnquire>({
    defaultValues: {
      _id: "",
      name: "",
      email: "",
      phone: "",
      message: "",
      createdAt: new Date(),
    },
  });

  useEffect(() => {
    if (enquireToEdit) {
      setValue("_id", enquireToEdit._id ?? "");
      setValue("name", enquireToEdit.name ?? "");
      setValue("email", enquireToEdit.email ?? "");
      setValue("phone", enquireToEdit.phone ?? "");
      setValue("message", enquireToEdit.message ?? "");
      setValue("createdAt", enquireToEdit.createdAt ?? new Date());
    } else {
      reset();
    }
  }, [enquireToEdit, setValue, reset, isOpen]);

  const onSubmit = (data: IEnquire) => {
    onSubmitEnquire(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-background text-foreground rounded-xl shadow-2xl border border-border max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="pb-4 border-b border-border sticky top-0 z-10 bg-background text-foreground">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {enquireToEdit ? (
              <>
                <Edit3 size={20} className="text-primary" /> Edit Enquiry
              </>
            ) : (
              <>Add New Enquiry</>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 py-4">
          <input type="hidden" {...register("_id")} />

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter name"
              className="bg-card text-card-foreground rounded-lg p-3 border border-border focus:ring-2 focus:ring-ring transition"
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter email"
              className="bg-card text-card-foreground rounded-lg p-3 border border-border focus:ring-2 focus:ring-ring transition"
            />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Enter phone"
              className="bg-card text-card-foreground rounded-lg p-3 border border-border focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register("message", { required: "Message is required" })}
              placeholder="Enter message"
              className="bg-card text-card-foreground rounded-lg p-3 border border-border focus:ring-2 focus:ring-ring transition h-20 resize-none"
            />
            {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-4 flex justify-end gap-3 border-t border-border pt-4 sticky bottom-0 bg-background z-10">
            <AppButton
              variant="outline"
              type="button"
              className="flex items-center gap-2 border-border text-foreground hover:bg-muted transition"
              onClick={onClose}
            >
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton
              type="submit"
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              {enquireToEdit ? "Update Enquiry" : "Add Enquiry"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
