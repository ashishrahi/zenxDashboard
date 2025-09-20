"use client";

import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddBannerDialog } from "@/AppComponents/AppBannersDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useBanners,
  useAddBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "@/hooks/Banners/index";

import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";

export interface IBannerPayload {
  _id?: string;
  title: string;
  description?: string;
  image: string;
  isActive?: boolean;
}

export default function BannersPage() {
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
    b.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBanners.length / pageSize);
  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Open Add Dialog
  const openAddDialog = () => {
    setSelectedBanner(null);
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const openEditDialog = (banner: IBannerPayload) => {
    setSelectedBanner({ ...banner });
    setIsDialogOpen(true);
  };

  // Submit Banner
  const handleSubmitBanner = (banner: IBannerPayload) => {
    if (banner._id) {
      updateBanner.mutate(banner);
    } else {
      addBanner.mutate(banner);
    }
    setIsDialogOpen(false);
  };

  // Delete Banner
  const handleDelete = (banner: IBannerPayload) => deleteBanner.mutate(banner._id!);

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    {
      key: "image",
      label: "Image",
     
    },
    {
      key: "isActive",
      label: "Active",
    },
    {
      key: "createdAt",
      label: "Created At",
    },
    {
      key: "updatedAt",
      label: "Updated At",
    },
  ];

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        {/* Header Actions */}
        <AppHeaderActions
          title="Add Banner"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={openAddDialog}
        />

        {/* Table */}
        <div
          className={`border rounded-md transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${
            pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"
          }`}
        >
          {isLoading ? (
            <TableSkeleton rows={pageSize} />
          ) : (
            <GlobalTable
              columns={columns}
              data={paginatedBanners}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-2 gap-2 sm:gap-0">
          <PageSizeSelector
            pageSize={pageSize}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
          />
          <ShadCNPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Add/Edit Dialog */}
        <AddBannerDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitBanner={handleSubmitBanner}
          bannerToEdit={selectedBanner || undefined}
        />
      </div>
    </AppContainer>
  );
}
