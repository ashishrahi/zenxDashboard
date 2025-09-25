"use client";

import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable, Column } from "@/AppComponents/AppTable";
import { AddBannerDialog } from "@/AppComponents/AppBannerDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { IBannerPayload } from "@/types/IBannerPayload ";

import {
  useBanners,
  useAddBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "@/hooks/Banners";

import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import AppProtectedRoute from "@/AppComponents/AppProtectedRoute";

type BannerTableRow = IBannerPayload & { _id: string };

export default function BannerPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<IBannerPayload | null>(null);

  const { data: banners = [], isLoading } = useBanners();
  const addBanner = useAddBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const filteredBanners = banners.filter((b) =>
    (b.title ?? "").toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBanners.length / pageSize);
  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddDialog = () => {
    setSelectedBanner(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (banner: IBannerPayload) => {
    setSelectedBanner(banner);
    setIsDialogOpen(true);
  };

  const handleSubmitBanner = (banner: IBannerPayload) => {
    // Clean up the images property to remove null before passing to mutations
    const cleanedBanner = {
      ...banner,
      images: banner.images ?? undefined // Convert null to undefined
    };

    if (cleanedBanner._id) {
      updateBanner.mutate(cleanedBanner);
    } else {
      addBanner.mutate(cleanedBanner as Omit<IBannerPayload, "_id"> & { images?: File[] | undefined });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (banner: IBannerPayload) => {
    if (!banner._id) return;
    deleteBanner.mutate(banner._id);
  };

  const columns: Column<IBannerPayload>[] = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "images", label: "Images", render: (row) => row.images?.length || "No images" },
    { key: "isActive", label: "Active", render: (row) => (row.isActive ? "Yes" : "No") },
    { key: "createdAt", label: "Created At", render: (row) => new Date(row.createdAt ?? "").toLocaleDateString() },
    { key: "updatedAt", label: "Updated At", render: (row) => new Date(row.updatedAt ?? "").toLocaleDateString() },
  ];

  return (
    <AppProtectedRoute>
      <AppContainer>
        <div className="p-3 grid gap-6">
          <AppHeaderActions
            title="Add Banner"
            filterText={filterText}
            setFilterText={setFilterText}
            onAddClick={openAddDialog}
          />

          <div className={`border rounded-md transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"}`}>
            {isLoading ? (
              <TableSkeleton rows={pageSize} />
            ) : (
              <GlobalTable<IBannerPayload>
                columns={columns}
                data={paginatedBanners as BannerTableRow[]}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-2 gap-2 sm:gap-0">
            <PageSizeSelector pageSize={pageSize} setPageSize={setPageSize} setCurrentPage={setCurrentPage} />
            <ShadCNPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>

          <AddBannerDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onBannerSaved={handleSubmitBanner}
            bannerToEdit={selectedBanner || undefined}
          />
        </div>
      </AppContainer>
    </AppProtectedRoute>
  );
}