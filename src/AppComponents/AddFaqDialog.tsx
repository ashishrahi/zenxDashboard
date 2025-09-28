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
import { IFaq } from "@/types/faqTypes";

interface AddFaqDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFaq: (faq: IFaq) => void;
  faqToEdit?: IFaq;
}

export function AddFaqDialog({
  isOpen,
  onClose,
  onSubmitFaq,
  faqToEdit,
}: AddFaqDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IFaq>({
    defaultValues: {
      question: "",
      answer: "",
      createdAt: new Date(),
    },
  });

  // Set form values when editing an FAQ
  useEffect(() => {
    if (faqToEdit) {
      setValue("_id", faqToEdit._id);
      setValue("question", faqToEdit.question ?? "");
      setValue("answer", faqToEdit.answer ?? "");
      setValue("createdAt", faqToEdit.createdAt ?? new Date());
    } else {
      reset();
    }
  }, [faqToEdit, setValue, reset, isOpen]);

  // Handle form submit
  const onSubmit = (data: IFaq) => {
    const { _id, ...rest } = data;
    const payload = _id ? { _id, ...rest } : rest;
    onSubmitFaq(payload as IFaq);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-background text-foreground rounded-xl shadow-2xl border border-border max-h-[80vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-border sticky top-0 z-10 bg-background text-foreground">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {faqToEdit ? (
              <>
                <Edit3 size={20} className="text-primary" /> Edit FAQ
              </>
            ) : (
              <>Add New FAQ</>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 py-4">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              {...register("question", { required: "Question is required" })}
              placeholder="Enter question"
              className="bg-card text-card-foreground rounded-lg p-3 border border-border focus:ring-2 focus:ring-ring transition"
            />
            {errors.question && (
              <p className="text-destructive text-xs mt-1">{errors.question.message}</p>
            )}
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              {...register("answer", { required: "Answer is required" })}
              placeholder="Enter answer"
              className="bg-card text-card-foreground rounded-lg p-3 border border-border focus:ring-2 focus:ring-ring transition h-20 resize-none"
            />
            {errors.answer && (
              <p className="text-destructive text-xs mt-1">{errors.answer.message}</p>
            )}
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
              {faqToEdit ? "Update FAQ" : "Add FAQ"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
