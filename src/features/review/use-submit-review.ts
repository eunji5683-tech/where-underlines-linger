import { useMutation, useQueryClient } from '@tanstack/react-query';

import { submitReview } from '@/features/review/api';

export function useSubmitReview(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', 'due', userId] });
    },
  });
}
