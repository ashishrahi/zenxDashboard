"use client"
export interface IStatePayload {
  _id: string;
  name: string;
  code: string;
  countryId: string;  // new field
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddStateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stateToEdit?: IStatePayload | null;
  onSubmit: (state: IStatePayload) => void;
  isLoading?: boolean;
}
