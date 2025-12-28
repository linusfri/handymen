import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser, loginUser, logoutUser } from 'lib/services/user-service';
import { useBoundStore } from 'lib/store/store';

type LoginParams = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export function useAuth() {
  const queryClient = useQueryClient();
  const { status, signIn, signOut, token } = useBoundStore();
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: status === 'signIn', // Only run if we're signed in
    refetchInterval: 60000,
  });

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ username, password, rememberMe }: LoginParams) =>
      await loginUser(username, password, 'mobile', rememberMe),
    onSuccess: (data, variables) => {
      signIn(data.token, variables.rememberMe);
    },
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      signOut();
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });

  return {
    user: userQuery.data,
    isAuthenticated: status === 'signIn' && !!token,
    isLoading: userQuery.isLoading || logoutMutation.isPending,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    error: userQuery.error,
  };
}

export default useAuth;
