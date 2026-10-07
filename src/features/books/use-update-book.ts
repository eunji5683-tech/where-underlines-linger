import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateBook } from '@/features/books/api';

export function useUpdateBook(userId: string | undefined, sourceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', sourceId] });
      queryClient.invalidateQueries({ queryKey: ['books', userId] });
    },
  });
}
