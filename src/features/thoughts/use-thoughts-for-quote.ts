import { useQuery } from '@tanstack/react-query';

import { listThoughtsForQuote } from '@/features/thoughts/api';

export function useThoughtsForQuote(quoteId: string) {
  return useQuery({
    queryKey: ['thoughts', 'quote', quoteId],
    queryFn: () => listThoughtsForQuote(quoteId),
  });
}
