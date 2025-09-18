"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { IBlog } from "@/types/blogTypes";

interface AddBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBlog: (blog: IBlog) => void;
  blogToEdit?: IBlog;
}

export function AddBlogDialog({
  isOpen,
  onClose,
  onSubmitBlog,
  blogToEdit,
}: AddBlogDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<IBlog>({
    defaultValues: {
      title: "",
      author: "",
      category: "",
      content: "",
      publishedDate: "",
    },
  });

  // Prefill form when editing
  useEffect(() => {
    if (blogToEdit) {
      setValue("title", blogToEdit.title);
      setValue("author", blogToEdit.author);
      setValue("category", blogToEdit.category);
      setValue("content", blogToEdit.content);
      setValue("publishedDate", blogToEdit.publishedDate);
    } else {
      reset();
    }
  }, [blogToEdit, setValue, reset, isOpen]);

  const onSubmit = (data: IBlog) => {
    if (blogToEdit) data = { ...data, ...blogToEdit }; // preserve any existing properties
    onSubmitBlog(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-primary">
        <DialogHeader>
          <DialogTitle>{blogToEdit ? "Edit Blog" : "Add New Blog"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          <Input
            {...register("title", { required: true })}
            placeholder="Title"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("author", { required: true })}
            placeholder="Author"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("category", { required: true })}
            placeholder="Category"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Textarea
            {...register("content", { required: true })}
            placeholder="Content"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />
          <Input
            {...register("publishedDate", { required: true })}
            placeholder="Published Date"
            type="date"
            className="bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
          />

          <DialogFooter className="mt-2 flex justify-end gap-2">
            <Button variant="destructive" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{blogToEdit ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
