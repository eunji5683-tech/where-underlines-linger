import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createQuote } from '@/features/quotes/api';

export function useCreateQuote(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes', userId] });
    },
  });
}
