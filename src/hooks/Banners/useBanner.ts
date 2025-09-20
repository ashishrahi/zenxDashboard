"use client";
import { useQuery } from "@tanstack/react-query";
import { BannerService } from "@/services/bannerService";
import { IBannerPayload } from "@/AppComponents/AppBannersDialog";

export const useBanner = (id: string) => {
  return useQuery<IBannerPayload, Error>({
    queryKey: ["banner", id], // unique key for this banner
    queryFn: () => BannerService.getById(id), // fetch function for single banner
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
