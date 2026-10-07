import { useQuery } from '@tanstack/react-query';

import { listWatchSources } from '@/features/sources/api';
import type { SourceStatus } from '@/types/database';

export function useWatchSources(userId: string | undefined, status: SourceStatus) {
  return useQuery({
    queryKey: ['sources', 'watch', userId, status],
    queryFn: () => listWatchSources(userId as string, status),
    enabled: !!userId,
  });
}
