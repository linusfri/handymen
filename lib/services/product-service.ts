import axiosClient from 'lib/api/axios-client';
import { Product, ProductCreateData, ProductEditData } from 'lib/types/product';

export async function getProducts() {
  return (await axiosClient.get<Product[]>('/products')).data;
}

export async function getProduct(id: number) {
  return (await axiosClient.get<Product>(`/products/${id}`)).data;
}

export async function createProduct(requestData: ProductCreateData) {
  return (await axiosClient.post<Product>('/products', requestData)).data;
}

export async function editProduct(requestData: ProductEditData) {
  return (await axiosClient.put<Product>(`/products/${requestData.id}`, requestData)).data;
}

export async function deleteProduct(id: number) {
  return (await axiosClient.delete(`/products/${id}`)).data;
}
