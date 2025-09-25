"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BannerService } from "@/services/bannerService";
import { IBannerPayload } from "@/types/IBannerPayload ";

export const useAddBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IBannerPayload,
    Error,
    Omit<IBannerPayload, "_id"> & { images?: File[] }
  >({
    mutationFn: (newBanner) => {
      // Ensure images is undefined if null
      const payload = {
        ...newBanner,
        images: newBanner.images || undefined,
      };
      return BannerService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};
