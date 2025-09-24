"use client";
import { useQuery } from "@tanstack/react-query";
import { EnquireService } from "@/services/enquireService"; // make sure this exists
import { IEnquire } from "@/types/IEnquireTypes";

export const useEnquire = (id: string) => {
  return useQuery<IEnquire, Error>({
    queryKey: ["enquire", id], // unique key for this enquiry
    queryFn: () => EnquireService.getById(id), // fetch single enquiry by ID
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
