"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactService } from "@/services/contactService"; // make sure this exists
import { IContact } from "@/types/IContactTypes";

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation<IContact, Error, IContact>({
    mutationFn: (updatedContact: IContact) => ContactService.update(updatedContact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
