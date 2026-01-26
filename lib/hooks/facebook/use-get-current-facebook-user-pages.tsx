import { useQuery } from '@tanstack/react-query';
import TIME from 'lib/constants/time';
import { getCurrentFacebookUserPages } from 'lib/services/facebook-service';

export function useCurrentFacebookUserPages({facebookUserId}: {facebookUserId: string | undefined}) {
  const facebookUserPagesQuery = useQuery({
    queryKey: ['facebook-user-pages', facebookUserId],
    queryFn: getCurrentFacebookUserPages,
    enabled: !!facebookUserId,
    staleTime: TIME.FIVE_MINUTES,
  });

  return {
    facebookUserPages: facebookUserPagesQuery.data,
    isLoading: facebookUserPagesQuery.isLoading,
    isError: facebookUserPagesQuery.isError,
    error: facebookUserPagesQuery.error,
  };
}
