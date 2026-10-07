import { useQuery } from '@tanstack/react-query';

import { listQuotes, type ListQuotesFilters } from '@/features/quotes/api';

export function useQuotes(userId: string | undefined, filters: ListQuotesFilters) {
  return useQuery({
    queryKey: ['quotes', userId, filters],
    queryFn: () => listQuotes(userId as string, filters),
    enabled: !!userId,
  });
}
