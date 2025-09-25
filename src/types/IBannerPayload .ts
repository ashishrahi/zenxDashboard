export interface IBannerPayload {
  _id: string; // Banner ID (optional for new banners)
  title: string; // Banner title
  description?: string; // Banner description
  link?: string; // Optional URL for the banner
  images?: File[] | null; // New uploaded files
  existingImages?: string[]; // URLs of images already saved on server
  isActive: boolean; // Whether banner is active
  createdAt?: string; // Optional: timestamp of creation
  updatedAt?: string; // Optional: timestamp of last update
}
