"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BannerService } from "@/services/bannerService";
import { IBannerPayload } from "@/AppComponents/AppBannersDialog";

export const useAddBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<IBannerPayload, Error, Omit<IBannerPayload, "_id">>({
    mutationFn: (newBanner) => BannerService.create(newBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};
