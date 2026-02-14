import { FileData } from 'lib/types/file';

export type ProductStatus = 'available' | 'sold';
export type ProductIntegrations = [
  {
    platform: 'facebook' | 'instagram';
    resource_id: string;
  },
];

export type Product = {
  id: number;
  name: string;
  description: string | null;
  status: ProductStatus;
  images: FileData[];
  price: number;
  integrations?: ProductIntegrations;
  created_at?: number; // Unix timestamp
  updated_at?: number; // Unix timestamp
};

export type ProductCreateData = {
  name: string;
  description?: string;
  status: ProductStatus;
  price: number;
  image_ids: number[];
  integrations?: ProductIntegrations;
};

export type ProductEditData = {
  name: string;
  description?: string;
  status: ProductStatus;
  price: number;
  image_ids: number[];
  integrations?: ProductIntegrations;
};
