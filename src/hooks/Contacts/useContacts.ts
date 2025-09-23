"use client";

import { useQuery } from "@tanstack/react-query";
import { ContactService } from "@/services/contactService"; // create this service
import { IContact } from "@/types/IContactTypes";

export const useContacts = () => {
  return useQuery<IContact[], Error>({
    queryKey: ["contacts"],
    queryFn: ContactService.getAll, // fetches all contacts from your backend
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
