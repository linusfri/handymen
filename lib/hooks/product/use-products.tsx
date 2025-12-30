import { useQuery } from '@tanstack/react-query';
import { getProducts } from 'lib/services/product-service';

export function useProducts() {
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  return {
    products: productsQuery.data,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
  };
}
