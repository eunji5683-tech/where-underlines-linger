import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/features/auth/use-session';
import { BookRegisterForm } from '@/features/books/book-register-form';
import { BookSearchResultItem } from '@/features/books/book-search-result-item';
import type { BookSearchResult } from '@/features/books/kakao-api';
import { booksStrings } from '@/features/books/strings';
import { useSearchBooks } from '@/features/books/use-search-books';
import { quotesStrings } from '@/features/quotes/strings';
import { useTheme } from '@/hooks/use-theme';

export default function BookSearchScreen() {
  const theme = useTheme();
  const { session, loading: sessionLoading } = useSession();
  const [query, setQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);
  const searchBooks = useSearchBooks();

  if (sessionLoading) {
    return (
      <ScreenContainer style={styles.centered}>
        <ActivityIndicator />
      </ScreenContainer>
    );
  }

  if (!session) {
    return (
      <ScreenContainer style={styles.centered}>
        <ThemedText themeColor="textSecondary">{quotesStrings.loginRequired}</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ThemedText>{booksStrings.back}</ThemedText>
      </Pressable>

      {selectedBook ? (
        <ThemedView style={styles.content}>
          <Pressable onPress={() => setSelectedBook(null)}>
            <ThemedText themeColor="textSecondary">{booksStrings.back}</ThemedText>
          </Pressable>
          <BookRegisterForm userId={session.user.id} book={selectedBook} />
        </ThemedView>
      ) : (
        <ThemedView style={styles.content}>
          <ThemedView style={styles.searchRow}>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
              placeholder={booksStrings.searchPlaceholder}
              placeholderTextColor={theme.textSecondary}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => query.trim() && searchBooks.mutate(query.trim())}
            />
            <Pressable
              style={[styles.searchButton, { backgroundColor: theme.backgroundElement }]}
              onPress={() => query.trim() && searchBooks.mutate(query.trim())}
              disabled={searchBooks.isPending}>
              <ThemedText type="smallBold">{booksStrings.searchButton}</ThemedText>
            </Pressable>
          </ThemedView>

          {searchBooks.isPending ? (
            <ActivityIndicator />
          ) : searchBooks.isError ? (
            <ThemedText style={styles.error}>{booksStrings.searchError}</ThemedText>
          ) : (
            <FlatList
              data={searchBooks.data ?? []}
              keyExtractor={(item, index) => `${item.isbn ?? item.title}-${index}`}
              renderItem={({ item }) => (
                <BookSearchResultItem book={item} onPress={() => setSelectedBook(item)} />
              )}
              ListEmptyComponent={
                searchBooks.isSuccess ? (
                  <ThemedText themeColor="textSecondary">{booksStrings.noResults}</ThemedText>
                ) : null
              }
            />
          )}
        </ThemedView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
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
