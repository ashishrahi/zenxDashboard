"use client";
import { useQuery } from "@tanstack/react-query";
import { ContactService } from "@/services/contactService"; // make sure this exists
import { IContact } from "@/types/IContactTypes";

export const useContact = (id: string) => {
  return useQuery<IContact, Error>({
    queryKey: ["contact", id], // unique key for this contact
    queryFn: () => ContactService.getById(id), // fetch single contact by ID
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
