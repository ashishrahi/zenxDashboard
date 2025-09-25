"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BannerService } from "@/services/bannerService";
import { IBannerPayload } from "@/types/IBannerPayload ";

// Create a specific type for the mutation
type UpdateBannerPayload = IBannerPayload & {
  images?: File[];
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<IBannerPayload, Error, UpdateBannerPayload>({
    mutationFn: (updatedBanner: UpdateBannerPayload) => BannerService.update(updatedBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};