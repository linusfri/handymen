import axiosClient from 'lib/api/axios-client';
import { Product, ProductCreateData, ProductUpdateData } from 'lib/types/product';

export async function getFiles() {
  return (await axiosClient.get<Product[]>('/files')).data;
}

export async function getFile(id: number) {
  return (await axiosClient.get<Product>(`/files/${id}`)).data;
}

export async function createFile(input: ProductCreateData) {
  return (await axiosClient.post<Product>('/files', input)).data;
}

export async function updateFile(id: number, input: ProductUpdateData) {
  return (await axiosClient.put<Product>(`/files/${id}`, input)).data;
}

export async function deleteFile(id: number) {
  return (await axiosClient.delete(`/files/${id}`)).data;
}
