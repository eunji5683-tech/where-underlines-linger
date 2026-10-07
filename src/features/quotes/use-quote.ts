import { useQuery } from '@tanstack/react-query';

import { getQuote } from '@/features/quotes/api';

export function useQuote(id: string) {
  return useQuery({
    queryKey: ['quote', id],
    queryFn: () => getQuote(id),
  });
}
