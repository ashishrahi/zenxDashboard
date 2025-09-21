export interface IBannerPayload {
  id?: string;            // Banner ID, optional for creation
  title?: string;           // Banner title
  description?: string;    // Banner description
  image?: string;           // Banner image URL
  isActive?: boolean;       // Banner status
  createdAt?: string;      // Optional, returned by backend
  updatedAt?: string;      // Optional, returned by backend
}
