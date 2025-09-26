"use client"
export interface ICityPayload  {
  _id:string;
  name: string;
  code: string;
  stateId: string;
  status: boolean;
  createdAt: Date;
  updatedAt:Date

}
export interface AddCityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stateToEdit?: ICityPayload | null;
  onSubmit: (state: ICityPayload) => void;
  isLoading?: boolean;
  cityToEdit: ICityPayload | null;

}