import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Source } from '@/types/database';

interface WatchCardProps {
  source: Source;
}

export function WatchCard({ source }: WatchCardProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.cover} />
      <ThemedText type="small" numberOfLines={2}>
        {source.title}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 110,
    gap: 4,
  },
  cover: {
    width: 110,
    height: 150,
    borderRadius: 8,
  },
});
