import { ImageCreateData, ImageData } from "lib/types/image";

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
  images: ImageCreateData[];
};

export type ProductUpdateData = {
  name: string;
  description?: string;
  status: ProductStatus;
  price: number;
  images: ImageCreateData[];
};
