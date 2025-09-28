"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaqService } from "@/services/faqService"; // create this service
import { IFaq } from "@/types/faqTypes";

export const useAddFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<IFaq, Error, Omit<IFaq, "_id">>({
    mutationFn: (newFaq) => FaqService.create(newFaq),
    onSuccess: () => {
      // Invalidate the "faqs" query to refresh the list after adding
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};
