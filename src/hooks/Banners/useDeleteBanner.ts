"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BannerService } from "@/services/bannerService";

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => BannerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};
