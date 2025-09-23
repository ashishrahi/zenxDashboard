"use client";

import { useQuery } from "@tanstack/react-query";
import { ExportItemService } from "@/services/exportItemService"; // create this service
import { IExport } from "@/types/IExportItem";

export const useExportItems = () => {
  return useQuery<IExport[], Error>({
    queryKey: ["exportItems"], // unique query key
    queryFn: ExportItemService.getAll, // fetch all export items from backend
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
