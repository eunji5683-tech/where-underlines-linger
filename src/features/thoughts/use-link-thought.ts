import { useMutation, useQueryClient } from '@tanstack/react-query';

import { linkThoughtToQuote } from '@/features/thoughts/api';

export function useLinkThought(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: linkThoughtToQuote,
    onSuccess: (thought) => {
      queryClient.invalidateQueries({ queryKey: ['thoughts', 'unlinked', userId] });
      queryClient.invalidateQueries({ queryKey: ['thoughts', 'quote', thought.quote_id] });
    },
  });
}
