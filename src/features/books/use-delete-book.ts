import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteBook } from '@/features/books/api';

export function useDeleteBook(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books', userId] });
    },
  });
}
