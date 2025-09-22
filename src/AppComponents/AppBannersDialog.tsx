"use client";

import { useEffect, useState } from "react";
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
import { Upload, Trash2, XCircle, Image as ImageIcon, Edit3 } from "lucide-react";
import { AppButton } from "./AppButton";
import Image from "next/image";

export interface IBannerPayload {
  _id?: string;
  title: string;
  description?: string;
  image: string;
  isActive?: boolean;
  link?: string;
}

interface AddBannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBanner: (banner: IBannerPayload) => void;
  bannerToEdit?: IBannerPayload;
}

export function AddBannerDialog({
  isOpen,
  onClose,
  onSubmitBanner,
  bannerToEdit,
}: AddBannerDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IBannerPayload>({
    defaultValues: {
      _id: "",
      title: "",
      description: "",
      image: "",
      isActive: true,
    },
  });

  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (bannerToEdit) {
      setValue("_id", bannerToEdit._id ?? "");
      setValue("title", bannerToEdit.title ?? "");
      setValue("description", bannerToEdit.description ?? "");
      setValue("image", bannerToEdit.image ?? "");
      setValue("isActive", bannerToEdit.isActive ?? true);
      setUploadedImage(bannerToEdit.image ?? "");
    } else {
      reset();
      setUploadedImage("");
    }
  }, [bannerToEdit, setValue, reset, isOpen]);

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Replace this with actual Cloudinary or backend upload
      const uploadedUrl = await new Promise<string>((resolve) =>
        setTimeout(() => resolve(URL.createObjectURL(file)), 500)
      );
      setUploadedImage(uploadedUrl);
      setValue("image", uploadedUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setUploadedImage("");
    setValue("image", "");
  };

  const onSubmit = (data: IBannerPayload) => {
    onSubmitBanner(data);
    reset();
    setUploadedImage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {bannerToEdit ? (
              <>
                <Edit3 size={20} className="text-blue-500" /> Edit Banner
              </>
            ) : (
              <>
                <ImageIcon size={20} className="text-blue-500" /> Add New Banner
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 py-4">
          <input type="hidden" {...register("_id")} />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Banner Title
            </Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter banner title"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter banner description"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition h-24 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ImageIcon size={16} /> Banner Image
            </Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="imageUpload"
                className={`flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition ${
                  isUploading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <Upload size={16} />
                {isUploading ? "Uploading..." : "Upload Image"}
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isUploading}
              />
              {uploadedImage && <span className="text-xs text-gray-500 dark:text-gray-400">1 image selected</span>}
            </div>

            {uploadedImage && (
  <div className="relative mt-2 w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
    <Image
      src={uploadedImage}
      alt="banner preview"
      fill
      style={{ objectFit: "cover" }}
      priority={false} // set true if you want preloading
      sizes="128px" // optional for better optimization
    />
    <AppButton
      type="button"
      onClick={removeImage}
      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-70 hover:opacity-100 transition"
    >
      <Trash2 size={12} />
    </AppButton>
  </div>
)}
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
            <AppButton type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" disabled={isUploading}>
              <Upload size={16} /> {bannerToEdit ? "Update Banner" : "Add Banner"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
