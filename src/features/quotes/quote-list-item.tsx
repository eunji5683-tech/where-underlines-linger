import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Quote } from '@/types/database';

interface QuoteListItemProps {
  quote: Quote;
  sourceTitle: string | null;
}

export function QuoteListItem({ quote, sourceTitle }: QuoteListItemProps) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/quote/[id]', params: { id: quote.id } })}>
      <ThemedView type="backgroundElement" style={styles.container}>
        <ThemedText>{quote.text}</ThemedText>
        {sourceTitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {sourceTitle}
          </ThemedText>
        ) : null}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
});
