import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFiles, createFiles, deleteFile } from 'lib/services/image-service';

export function useFiles() {
  const queryClient = useQueryClient();

  const filesQuery = useQuery({
    queryKey: ['files'],
    queryFn: getFiles,
  });

  const uploadMutation = useMutation({
    mutationFn: createFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.refetchQueries({ queryKey: ['files'] });
    },
  });

  return {
    files: filesQuery.data,
    isLoading: filesQuery.isLoading,
    isError: filesQuery.isError,
    error: filesQuery.error,
    uploadFiles: uploadMutation.mutateAsync,
    deleteFiles: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

