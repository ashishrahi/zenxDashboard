"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactService } from "@/services/contactService"; // you need to create this
import { IContact } from "@/types/IContactTypes";

export const useAddContact = () => {
  const queryClient = useQueryClient();

  return useMutation<IContact, Error, Omit<IContact, "_id">>({
    mutationFn: (newContact) => ContactService.create(newContact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
