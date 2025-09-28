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
import { IBannerPayload } from "@/types/IBannerPayload ";
import { BannerService } from "@/services/bannerService";
import Image from "next/image";

export interface AddBannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bannerToEdit?: IBannerPayload;
  onBannerSaved?: (banner: IBannerPayload) => void;
}

export function AddBannerDialog({
  isOpen,
  onClose,
  bannerToEdit,
  onBannerSaved,
}: AddBannerDialogProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors }, watch } = useForm<IBannerPayload & { existingImages?: string[] }>({
    defaultValues: {
      _id: "",
      title: "",
      description: "",
      images: [],
      existingImages: [],
      isActive: true,
    },
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const existingImages = watch("existingImages") || [];

  useEffect(() => {
    if (bannerToEdit) {
      setValue("_id", bannerToEdit._id ?? "");
      setValue("title", bannerToEdit.title ?? "");
      setValue("description", bannerToEdit.description ?? "");
      setValue("isActive", bannerToEdit.isActive ?? true);

      const bannerImages = bannerToEdit.images?.map((img) =>
        typeof img === "string" ? img : URL.createObjectURL(img)
      ) ?? [];
      setValue("existingImages", bannerImages);
      setUploadedImages(bannerImages);
      setUploadedFiles([]);
    } else {
      reset();
      setUploadedImages([]);
      setUploadedFiles([]);
      setValue("existingImages", []);
    }
  }, [bannerToEdit, setValue, reset, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const urls = filesArray.map((file) => URL.createObjectURL(file));

    setUploadedImages((prev) => [...prev, ...urls]);
    setUploadedFiles((prev) => [...prev, ...filesArray]);
  };

  const removeImage = (index: number) => {
    const oldImagesCount = existingImages.length;

    setUploadedImages((prev) => prev.filter((_, i) => i !== index));

    if (index >= oldImagesCount) {
      const fileIndex = index - oldImagesCount;
      setUploadedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    } else {
      const updatedExistingImages = existingImages.filter((_, i) => i !== index);
      setValue("existingImages", updatedExistingImages, { shouldDirty: true });
    }
  };

  const onSubmit = async (data: IBannerPayload & { existingImages?: string[] }) => {
    setIsUploading(true);
    try {
      const payload: IBannerPayload & { images?: File[]; existingImages?: string[] } = {
        ...data,
        images: uploadedFiles.length ? uploadedFiles : undefined,
        existingImages: existingImages.length ? existingImages : undefined,
      };

      if (bannerToEdit?._id) {
        await BannerService.update(payload);
      } else {
        await BannerService.create(payload);
      }

      reset();
      setUploadedImages([]);
      setUploadedFiles([]);
      setValue("existingImages", []);
      onClose();
      onBannerSaved?.(payload);
    } catch (err) {
      console.error("Error saving banner:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-black dark:text-white">
            {bannerToEdit ? <><Edit3 size={20} className="text-blue-500" /> Edit Banner</> 
                          : <><ImageIcon size={20} className="text-blue-500" /> Add New Banner</>}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <input type="hidden" {...register("_id")} />
          <input type="hidden" {...register("existingImages")} />

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title" className="text-black dark:text-white">Banner Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="e.g., Summer Sale Banner"
              className="text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-black dark:text-white">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe this banner..."
              className="h-24 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            />
          </div>

          <div className="space-y-2 md:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="isActive" {...register("isActive")} className="w-5 h-5 accent-blue-600" />
            <Label htmlFor="isActive" className="text-black dark:text-white">Active</Label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-black dark:text-white">Images</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="imageUpload"
                className={`flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <Upload size={16} /> {isUploading ? "Uploading..." : "Upload Images"}
              </label>
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isUploading}
              />
              <span className="text-xs text-black dark:text-white">{uploadedImages.length} image(s) selected</span>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {uploadedImages.map((url, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border shadow-sm">
                    <Image 
                      src={url} 
                      alt={`preview-${idx}`} 
                      width={150} 
                      height={112} 
                      className="w-full h-28 object-cover" 
                    />
                    <AppButton
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 p-0 flex items-center justify-center"
                    >
                      <Trash2 size={12} />
                    </AppButton>
                    {idx < existingImages.length && (
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        Existing
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-3 md:col-span-2">
            <AppButton variant="outline" type="button" onClick={onClose}>
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton type="submit" disabled={isUploading}>
              <Upload size={16} /> {bannerToEdit ? "Update Banner" : "Add Banner"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
