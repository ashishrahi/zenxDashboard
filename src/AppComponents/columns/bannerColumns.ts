import { IBannerPayload } from "@/types/IBannerPayload ";
import { Column } from "@/types/ITable";

export const columns: Column<IBannerPayload>[] = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    {
      key: "images",
      label: "Images",
      render: (row) => row.images?.length || "No images",
    },
    {
      key: "isActive",
      label: "Active",
      render: (row) => (row.isActive ? "Yes" : "No"),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "updatedAt",
      label: "Updated At",
      render: (row) => new Date(row.updatedAt).toLocaleDateString(),
    },
  ];