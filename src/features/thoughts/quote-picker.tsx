import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useQuotes } from '@/features/quotes/use-quotes';
import { thoughtsStrings } from '@/features/thoughts/strings';
import { useTheme } from '@/hooks/use-theme';

interface QuotePickerProps {
  userId: string;
  onSelect: (quoteId: string) => void;
}

export function QuotePicker({ userId, onSelect }: QuotePickerProps) {
  const theme = useTheme();
  const { data: quotes, isLoading } = useQuotes(userId, { search: '', sourceId: null });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!quotes || quotes.length === 0) {
    return <ThemedText themeColor="textSecondary">{thoughtsStrings.linkPickerEmpty}</ThemedText>;
  }

  return (
    <ScrollView style={styles.list}>
      {quotes.map((quote) => (
        <Pressable
          key={quote.id}
          onPress={() => onSelect(quote.id)}
          style={[styles.item, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="small" numberOfLines={2}>
            {quote.text}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 200,
  },
  item: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
});
