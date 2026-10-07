import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createThought } from '@/features/thoughts/api';

export function useCreateThought(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createThought,
    onSuccess: (thought) => {
      if (thought.quote_id) {
        queryClient.invalidateQueries({ queryKey: ['thoughts', 'quote', thought.quote_id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['thoughts', 'unlinked', userId] });
      }
    },
  });
}
