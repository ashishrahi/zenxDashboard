"use client"
export interface ICategory {
  _id: string,
  name: string;
  slug: string;
  gender: string;
  description?: string;
  images: [];
}
