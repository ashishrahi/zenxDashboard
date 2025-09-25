"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BannerService } from "@/services/bannerService";
import { IBannerPayload } from "@/types/IBannerPayload ";

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<IBannerPayload, Error, IBannerPayload>({
    mutationFn: (updatedBanner: IBannerPayload) => BannerService.update(updatedBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};
