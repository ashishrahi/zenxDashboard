"use client";

import { useQuery } from "@tanstack/react-query";
import { FaqService } from "@/services/faqService"; // create this service
import { IFaq } from "@/types/faqTypes";

export const useFaqs = () => {
  return useQuery<IFaq[], Error>({
    queryKey: ["faqs"], // unique query key
    queryFn: FaqService.getAll, // fetch all FAQs from backend
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
