import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createWatchSource } from '@/features/sources/api';

export function useCreateWatchSource(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWatchSource,
    onSuccess: (source) => {
      queryClient.invalidateQueries({ queryKey: ['sources', 'watch', userId, source.status] });
    },
  });
}
