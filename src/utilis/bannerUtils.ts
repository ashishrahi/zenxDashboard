import { IBannerPayload } from "@/types/bannerTypes";

// Filter banners by text
export const filterBanners = (banners: IBannerPayload[], filterText: string) =>
  banners.filter((b) => (b.title ?? "").toLowerCase().includes(filterText.toLowerCase()));

// Paginate banners
export const paginateBanners = (
  banners: IBannerPayload[],
  currentPage: number,
  pageSize: number
) => {
  const totalPages = Math.ceil(banners.length / pageSize);
  const paginatedBanners = banners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return { paginatedBanners, totalPages };
};
