"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExportItemService } from "@/services/exportItemService"; // create this service

export const useDeleteExportItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => ExportItemService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exportItems"] });
    },
  });
};
