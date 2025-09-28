"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaqService } from "@/services/faqService"; // create this service

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => FaqService.delete(id),
    onSuccess: () => {
      // Refresh the FAQs list after deletion
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};
