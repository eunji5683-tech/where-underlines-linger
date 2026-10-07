import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/features/auth/use-session';
import { quotesStrings } from '@/features/quotes/strings';
import { useQuotes } from '@/features/quotes/use-quotes';
import { QuoteListItem } from '@/features/quotes/quote-list-item';
import { SourceFilter } from '@/features/sources/source-filter';
import { useSources } from '@/features/sources/use-sources';
import { useTheme } from '@/hooks/use-theme';

export default function QuotesScreen() {
  const theme = useTheme();
  const { session, loading: sessionLoading } = useSession();
  const [search, setSearch] = useState('');
  const [sourceId, setSourceId] = useState<string | null>(null);

  const userId = session?.user.id;
  const { data: sources } = useSources(userId);
  const {
    data: quotes,
    isLoading: quotesLoading,
    isError,
  } = useQuotes(userId, { search, sourceId });

  const sourceTitleById = useMemo(() => {
    const map = new Map<string, string>();
    sources?.forEach((source) => map.set(source.id, source.title));
    return map;
  }, [sources]);

  if (sessionLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!session || !userId) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">{quotesStrings.loginRequired}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">문장함</ThemedText>

      <TextInput
        style={[styles.search, { color: theme.text, borderColor: theme.textSecondary }]}
        placeholder={quotesStrings.searchPlaceholder}
        placeholderTextColor={theme.textSecondary}
        value={search}
        onChangeText={setSearch}
      />

      <SourceFilter userId={userId} selectedSourceId={sourceId} onSelect={setSourceId} />

      {quotesLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ThemedText style={styles.error}>{quotesStrings.loadError}</ThemedText>
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <QuoteListItem
              quote={item}
              sourceTitle={item.source_id ? sourceTitleById.get(item.source_id) ?? null : null}
            />
          )}
          ListEmptyComponent={
            <ThemedText themeColor="textSecondary">
              {search || sourceId ? quotesStrings.emptyFiltered : quotesStrings.emptyList}
            </ThemedText>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  search: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  list: {
    gap: 8,
  },
  error: {
    color: '#D64545',
  },
});
