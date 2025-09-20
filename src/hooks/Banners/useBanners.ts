"use client";

import { useQuery } from "@tanstack/react-query";
import { BannerService } from "@/services/bannerService";
import { IBannerPayload } from "@/AppComponents/AppBannersDialog";

export const useBanners = () => {
  return useQuery<IBannerPayload[], Error>({
    queryKey: ["banners"],
    queryFn: BannerService.getAll, // Make sure BannerService.getAll calls your API
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
