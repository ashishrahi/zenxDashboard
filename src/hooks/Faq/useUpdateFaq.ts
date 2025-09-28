"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaqService } from "@/services/faqService"; // create this service
import { IFaq } from "@/types/faqTypes"; // define this type

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<IFaq, Error, IFaq>({
    mutationFn: (updatedFaq: IFaq) => FaqService.update(updatedFaq),
    onSuccess: () => {
      // Refresh the FAQs list after update
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};
