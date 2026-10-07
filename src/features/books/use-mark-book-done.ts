import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markBookDone } from '@/features/books/api';

export function useMarkBookDone(userId: string | undefined, sourceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markBookDone(sourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', sourceId] });
      queryClient.invalidateQueries({ queryKey: ['books', userId] });
    },
  });
}
