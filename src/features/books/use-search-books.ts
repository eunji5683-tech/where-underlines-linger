import { useMutation } from '@tanstack/react-query';

import { searchBooks } from '@/features/books/kakao-api';

export function useSearchBooks() {
  return useMutation({
    mutationFn: searchBooks,
  });
}
