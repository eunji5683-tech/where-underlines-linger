import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateQuote } from '@/features/quotes/api';

export function useUpdateQuote(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuote,
    onSuccess: (quote) => {
      queryClient.invalidateQueries({ queryKey: ['quotes', userId] });
      queryClient.invalidateQueries({ queryKey: ['quote', quote.id] });
    },
  });
}
