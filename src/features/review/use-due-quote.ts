import { useQuery } from '@tanstack/react-query';

import { getDueQuote } from '@/features/review/api';

export function useDueQuote(userId: string | undefined) {
  return useQuery({
    queryKey: ['review', 'due', userId],
    queryFn: () => getDueQuote(userId as string),
    enabled: !!userId,
  });
}
