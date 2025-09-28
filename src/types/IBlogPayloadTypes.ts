// types/IBlogPayloadTypes.ts
export interface IBlogPayload {
  _id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  images?: string[]; // URLs from backend
  tags?: string[];
  author?: string;
  createdAt: string;
  updatedAt: string;
  message:string;
  success?:string;
}