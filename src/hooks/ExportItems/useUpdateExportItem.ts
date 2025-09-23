"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExportItemService } from "@/services/exportItemService"; // create this service
import { IExport } from "@/types/IExportItem"; // define this type

export const useUpdateExportItem = () => {
  const queryClient = useQueryClient();

  return useMutation<IExport, Error, IExport>({
    mutationFn: (updatedItem: IExport) => ExportItemService.update(updatedItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exportItems"] });
    },
  });
};
