import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logReadingSession } from '@/features/books/api';

export function useLogReadingSession(userId: string | undefined, sourceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logReadingSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', sourceId] });
      queryClient.invalidateQueries({ queryKey: ['books', userId] });
    },
  });
}
