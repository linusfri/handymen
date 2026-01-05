import { useQuery } from '@tanstack/react-query';
import { getFacebookUser } from 'lib/services/facebook-service';

export function useGetFacebookUser() {
  const facebookUserQuery = useQuery({
    queryKey: ['facebook-user'],
    queryFn: getFacebookUser,
  });

  return {
    facebookUser: facebookUserQuery.data,
    isLoading: facebookUserQuery.isLoading,
    isError: facebookUserQuery.isError,
    error: facebookUserQuery.error,
  };
}
