import { ImageData } from "lib/types/file";

export type ProductStatus = 'available' | 'sold';

export type Product = {
  id: number;
  name: string;
  description: string | null;
  status: ProductStatus;
  images: ImageData[];
  price: number;
  created_at?: number; // Unix timestamp
  updated_at?: number; // Unix timestamp
};

export type ProductCreateData = {
  name: string;
  description?: string;
  status: ProductStatus;
  price: number;
  image_ids: number[];
};

export type ProductEditData = {
  name: string;
  description?: string;
  status: ProductStatus;
  price: number;
  image_ids: number[];
};
