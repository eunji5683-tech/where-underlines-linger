import { useQuery } from '@tanstack/react-query';

import { listSources } from '@/features/sources/api';

export function useSources(userId: string | undefined) {
  return useQuery({
    queryKey: ['sources', userId],
    queryFn: () => listSources(userId as string),
    enabled: !!userId,
  });
}
