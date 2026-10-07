import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/features/auth/use-session';
import { BookCard } from '@/features/books/book-card';
import { booksStrings } from '@/features/books/strings';
import { useBooks } from '@/features/books/use-books';
import { quotesStrings } from '@/features/quotes/strings';
import { watchStrings } from '@/features/sources/strings';
import { useWatchSources } from '@/features/sources/use-watch-sources';
import { WatchCard } from '@/features/sources/watch-card';
import { WatchForm } from '@/features/sources/watch-form';
import { useTheme } from '@/hooks/use-theme';
import type { SourceStatus } from '@/types/database';

const TABS: { status: SourceStatus; label: string }[] = [
  { status: 'ongoing', label: booksStrings.tabOngoing },
  { status: 'done', label: booksStrings.tabDone },
  { status: 'wish', label: booksStrings.tabWish },
];

export default function ReadingScreen() {
  const theme = useTheme();
  const { session, loading: sessionLoading } = useSession();
  const [contentType, setContentType] = useState<'book' | 'watch'>('book');
  const [status, setStatus] = useState<SourceStatus>('ongoing');
  const [showWatchForm, setShowWatchForm] = useState(false);
  const userId = session?.user.id;
  const books = useBooks(userId, status);
  const watch = useWatchSources(userId, status);

  if (sessionLoading) {
    return (
      <ScreenContainer style={styles.centered}>
        <ActivityIndicator />
      </ScreenContainer>
    );
  }

  if (!session || !userId) {
    return (
      <ScreenContainer style={styles.centered}>
        <ThemedText themeColor="textSecondary">{quotesStrings.loginRequired}</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <ThemedText type="title">독서</ThemedText>

      <ThemedView style={styles.contentTypeRow}>
        <Pressable
          onPress={() => setContentType('book')}
          style={[
            styles.tabChip,
            { backgroundColor: contentType === 'book' ? theme.backgroundSelected : theme.backgroundElement },
          ]}>
          <ThemedText type="small">{watchStrings.toggleBook}</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setContentType('watch')}
          style={[
            styles.tabChip,
            { backgroundColor: contentType === 'watch' ? theme.backgroundSelected : theme.backgroundElement },
          ]}>
          <ThemedText type="small">{watchStrings.toggleWatch}</ThemedText>
        </Pressable>
      </ThemedView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.status}
            onPress={() => setStatus(tab.status)}
            style={[
              styles.tabChip,
              { backgroundColor: status === tab.status ? theme.backgroundSelected : theme.backgroundElement },
            ]}>
            <ThemedText type="small">{tab.label}</ThemedText>
          </Pressable>
        ))}
        {contentType === 'book' ? (
          <Pressable
            onPress={() => router.push('/book/search')}
            style={[styles.tabChip, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="small">{booksStrings.addNew}</ThemedText>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setShowWatchForm(true)}
            style={[styles.tabChip, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="small">{watchStrings.addNew}</ThemedText>
          </Pressable>
        )}
      </ScrollView>

      {contentType === 'watch' && showWatchForm ? (
        <WatchForm userId={userId} onDone={() => setShowWatchForm(false)} />
      ) : contentType === 'book' ? (
        books.isLoading ? (
          <ActivityIndicator />
        ) : books.isError ? (
          <ThemedText style={styles.error}>{booksStrings.loadError}</ThemedText>
        ) : (
          <FlatList
            data={books.data}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => <BookCard book={item} />}
            ListEmptyComponent={<ThemedText themeColor="textSecondary">{booksStrings.emptyList}</ThemedText>}
          />
        )
      ) : watch.isLoading ? (
        <ActivityIndicator />
      ) : watch.isError ? (
        <ThemedText style={styles.error}>{watchStrings.loadError}</ThemedText>
      ) : (
        <FlatList
          data={watch.data}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => <WatchCard source={item} />}
          ListEmptyComponent={<ThemedText themeColor="textSecondary">{watchStrings.emptyList}</ThemedText>}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  contentTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabs: {
    flexGrow: 0,
  },
  tabsContent: {
    flexDirection: 'row',
    gap: 8,
  },
  tabChip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  grid: {
    gap: 16,
  },
  row: {
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  error: {
    color: '#D64545',
  },
});
