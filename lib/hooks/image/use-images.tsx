import { useQuery } from '@tanstack/react-query';
import { getFiles } from 'lib/services/image-service';

export function useImages() {
  const imagesQuery = useQuery({
    queryKey: ['images'],
    queryFn: getFiles,
  });

  return {
    images: imagesQuery.data,
    isLoading: imagesQuery.isLoading,
    isError: imagesQuery.isError,
    error: imagesQuery.error,
  };
}
