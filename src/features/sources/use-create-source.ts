import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSource } from '@/features/sources/api';

export function useCreateSource(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources', userId] });
    },
  });
}
