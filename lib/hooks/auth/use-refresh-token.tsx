import { useMutation } from '@tanstack/react-query';
import { refreshToken } from 'lib/services/user-service';
import { useBoundStore } from 'lib/store/store';
import { useEffect } from 'react';
import useAuth from 'lib/hooks/auth/use-auth';

export default function useRefreshToken() {
  const { refreshClientToken, token } = useBoundStore();
  const { user } = useAuth();

  const refreshTokenMutation = useMutation({
    mutationKey: ['refreshToken'],
    mutationFn: async ({ _refreshToken }: { _refreshToken: string }) =>
      await refreshToken(_refreshToken),
    onSuccess: (data) => {
      refreshClientToken(data.token);
    },
    retry: true,
  });

  useEffect(() => {
    if (!user || !token?.refresh_token) return;
    const FIVE_MINUTES = 1000 * 60 * 5;

    const interval = setInterval(() => {
      refreshTokenMutation.mutate({ _refreshToken: token.refresh_token });
    }, FIVE_MINUTES);
    return () => clearInterval(interval);
  }, [user, token?.refresh_token]);
}
