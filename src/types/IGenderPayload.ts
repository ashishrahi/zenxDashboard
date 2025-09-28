export interface IGenderPayload {
  _id: string;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddGenderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  genderToEdit?: IGenderPayload;
  onSubmit: (gender: IGenderPayload) => void;
  isLoading?: boolean;
}
