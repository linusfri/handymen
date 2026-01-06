import { useQuery } from '@tanstack/react-query';
import { getCurrentFacebookUserPages } from 'lib/services/facebook-service';
import { FacebookUser } from 'lib/types/facebook';

export function useCurrentFacebookUserPages({facebookUser}: {facebookUser: FacebookUser | undefined}) {
  const facebookUserPagesQuery = useQuery({
    queryKey: ['facebook-user-pages', facebookUser?.id],
    queryFn: getCurrentFacebookUserPages,
    enabled: !!facebookUser,
  });

  return {
    facebookUserPages: facebookUserPagesQuery.data,
    isLoading: facebookUserPagesQuery.isLoading,
    isError: facebookUserPagesQuery.isError,
    error: facebookUserPagesQuery.error,
  };
}
