import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, editProduct } from 'lib/services/product-service';
import { ProductCreateData, ProductEditData } from 'lib/types/product';

export function useProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const createProductMutation = useMutation({
    mutationFn: (data: ProductCreateData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const editProductMutation = useMutation({
    mutationFn: (data: ProductEditData) => editProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: productsQuery.data,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    createProduct: createProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    editProduct: editProductMutation.mutateAsync,
    isEditing: editProductMutation.isPending,
  };
}
