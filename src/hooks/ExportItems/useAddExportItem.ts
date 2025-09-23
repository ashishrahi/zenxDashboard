"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExportItemService } from "@/services/exportItemService"; // create this service
import { IExport } from "@/types/IExportItem";

export const useAddExportItem = () => {
  const queryClient = useQueryClient();

  return useMutation<IExport, Error, Omit<IExport, "_id">>({
    mutationFn: (newItem) => ExportItemService.create(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exportItems"] });
    },
  });
};
