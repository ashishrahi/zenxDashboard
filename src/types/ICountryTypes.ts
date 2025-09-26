export interface ICountryPayload {
  _id: string; // optional for new countries
  name: string;
  code: string;
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddCountryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  countryToEdit?: ICountryPayload | null;
  onSubmit: (country: ICountryPayload) => void;
  isLoading?: boolean;
  onCountrySaved?: (country: ICountryPayload) => void;
}
