"use client";

import axiosInstance from "@/lib/axios";
import { IContact } from "@/types/IContactTypes";

export const ContactService = {
  // Fetch all contacts
  getAll: async (): Promise<IContact[]> => {
    const response = await axiosInstance.get("/contacts");
    return response?.data?.data;
  },

  // Fetch a single contact by ID
  getById: async (id: string): Promise<IContact> => {
    const response = await axiosInstance.get(`/contacts/${id}`);
    return response?.data?.data;
  },

  // Create a new contact
  create: async (contact: Omit<IContact, "_id">) => {
    const response = await axiosInstance.post("/contacts/create", contact);
    return response?.data?.data;
  },

  // Update an existing contact
  update: async (contact: IContact) => {
    const response = await axiosInstance.put(`/contacts/update/${contact._id}`, contact);
    return response?.data?.data;
  },

  // Delete a contact by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/contacts/delete/${id}`);
  },
};
