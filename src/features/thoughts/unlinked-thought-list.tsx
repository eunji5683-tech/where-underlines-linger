import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { thoughtsStrings } from '@/features/thoughts/strings';
import { UnlinkedThoughtItem } from '@/features/thoughts/unlinked-thought-item';
import { useUnlinkedThoughts } from '@/features/thoughts/use-unlinked-thoughts';

interface UnlinkedThoughtListProps {
  userId: string;
}

export function UnlinkedThoughtList({ userId }: UnlinkedThoughtListProps) {
  const { data: thoughts, isLoading, isError } = useUnlinkedThoughts(userId);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="smallBold">{thoughtsStrings.unlinkedTitle}</ThemedText>

      {isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ThemedText style={styles.error}>{thoughtsStrings.loadError}</ThemedText>
      ) : thoughts && thoughts.length > 0 ? (
        thoughts.map((thought) => <UnlinkedThoughtItem key={thought.id} userId={userId} thought={thought} />)
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          {thoughtsStrings.unlinkedEmpty}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  error: {
    color: '#D64545',
  },
});
