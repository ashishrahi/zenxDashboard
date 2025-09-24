"use client";

import { useQuery } from "@tanstack/react-query";
import { EnquireService } from "@/services/enquireService"; // create this service
import { IEnquire } from "@/types/IEnquireTypes";

export const useEnquires = () => {
  return useQuery<IEnquire[], Error>({
    queryKey: ["enquires"],
    queryFn: EnquireService.getAll, // fetches all enquiries from your backend
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
