import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBook } from '@/features/books/api';

export function useCreateBook(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: (book) => {
      queryClient.invalidateQueries({ queryKey: ['books', userId, book.status] });
    },
  });
}
