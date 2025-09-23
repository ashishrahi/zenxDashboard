"use client";
import { useQuery } from "@tanstack/react-query";
import { ExportItemService } from "@/services/exportItemService"; // create this service
import { IExport } from "@/types/IExportItem"; // define this type

export const useExportItem = (id: string) => {
  return useQuery<IExport, Error>({
    queryKey: ["exportItem", id], // unique key for this export item
    queryFn: () => ExportItemService.getById(id), // fetch single item by ID
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
