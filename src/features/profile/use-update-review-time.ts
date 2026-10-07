import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateReviewTime } from '@/features/profile/api';

export function useUpdateReviewTime(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReviewTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}
