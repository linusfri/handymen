import { useMutation } from '@tanstack/react-query';
import { initiateFacebookLogin } from 'lib/services/facebook-service';

export function useFacebookLogin() {
  const facebookLoginMutation = useMutation({
    mutationKey: ['facebook-login-initiate'],
    mutationFn: initiateFacebookLogin,
  });

  return {
    isLoading: facebookLoginMutation.isPending,
    isError: facebookLoginMutation.isError,
    error: facebookLoginMutation.error,
    initiateLogin: facebookLoginMutation.mutate,
    initiateLoginAsync: facebookLoginMutation.mutateAsync,
  };
}
