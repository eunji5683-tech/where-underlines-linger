import { useQuery } from '@tanstack/react-query';

import { listBooks } from '@/features/books/api';
import type { SourceStatus } from '@/types/database';

export function useBooks(userId: string | undefined, status: SourceStatus) {
  return useQuery({
    queryKey: ['books', userId, status],
    queryFn: () => listBooks(userId as string, status),
    enabled: !!userId,
  });
}
