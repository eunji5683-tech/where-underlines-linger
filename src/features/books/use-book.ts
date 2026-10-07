import { useQuery } from '@tanstack/react-query';

import { getBook } from '@/features/books/api';

export function useBook(sourceId: string) {
  return useQuery({
    queryKey: ['book', sourceId],
    queryFn: () => getBook(sourceId),
  });
}
