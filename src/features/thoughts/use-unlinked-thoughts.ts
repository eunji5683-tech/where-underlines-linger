import { useQuery } from '@tanstack/react-query';

import { listUnlinkedThoughts } from '@/features/thoughts/api';

export function useUnlinkedThoughts(userId: string | undefined) {
  return useQuery({
    queryKey: ['thoughts', 'unlinked', userId],
    queryFn: () => listUnlinkedThoughts(userId as string),
    enabled: !!userId,
  });
}
