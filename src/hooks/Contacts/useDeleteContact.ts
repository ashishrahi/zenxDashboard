"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactService } from "@/services/contactService"; // ensure correct path

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => ContactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
