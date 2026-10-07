import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/features/auth/use-session';
import { BookEditForm } from '@/features/books/book-edit-form';
import { booksStrings } from '@/features/books/strings';
import { useBook } from '@/features/books/use-book';
import { useDeleteBook } from '@/features/books/use-delete-book';
import { useMarkBookDone } from '@/features/books/use-mark-book-done';
import { ReadingTimer } from '@/features/books/reading-timer';
import { QuoteListItem } from '@/features/quotes/quote-list-item';
import { QuoteQuickAdd } from '@/features/quotes/quote-quick-add';
import { quotesStrings } from '@/features/quotes/strings';
import { useQuotes } from '@/features/quotes/use-quotes';
import { useTheme } from '@/hooks/use-theme';

export default function BookDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session, loading: sessionLoading } = useSession();
  const { data: book, isLoading: bookLoading, isError } = useBook(id);
  const markDone = useMarkBookDone(session?.user.id, id);
  const deleteBook = useDeleteBook(session?.user.id);
  const { data: quotes } = useQuotes(session?.user.id, { search: '', sourceId: id });
  const [isEditing, setIsEditing] = useState(false);

  function handleDelete() {
    Alert.alert(booksStrings.deleteConfirmTitle, booksStrings.deleteConfirmMessage, [
      { text: booksStrings.deleteConfirmCancel, style: 'cancel' },
      {
        text: booksStrings.deleteConfirmOk,
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBook.mutateAsync(id);
            router.back();
          } catch {
            Alert.alert(booksStrings.deleteError);
          }
        },
      },
    ]);
  }

  const loading = sessionLoading || bookLoading;
  const details = book?.book_details;
  const progressRatio = details && details.total_pages ? details.current_page / details.total_pages : 0;

  return (
    <ScreenContainer style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ThemedText>{booksStrings.back}</ThemedText>
      </Pressable>

      {loading ? (
        <ThemedView style={styles.centered}>
          <ActivityIndicator />
        </ThemedView>
      ) : !session ? (
        <ThemedView style={styles.centered}>
          <ThemedText themeColor="textSecondary">{quotesStrings.loginRequired}</ThemedText>
        </ThemedView>
      ) : isError || !book ? (
        <ThemedView style={styles.centered}>
          <ThemedText themeColor="textSecondary">{booksStrings.bookNotFound}</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {isEditing ? (
            <BookEditForm userId={session.user.id} book={book} onDone={() => setIsEditing(false)} />
          ) : (
            <>
              <ThemedView style={styles.header}>
                <ThemedView type="backgroundElement" style={styles.cover}>
                  {book.cover_url ? (
                    <Image source={{ uri: book.cover_url }} style={styles.coverImage} contentFit="cover" />
                  ) : null}
                </ThemedView>
                <ThemedView style={styles.headerText}>
                  <ThemedText type="subtitle">{book.title}</ThemedText>
                  {book.creator ? (
                    <ThemedText themeColor="textSecondary">{book.creator}</ThemedText>
                  ) : null}
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.editDeleteRow}>
                <Pressable onPress={() => setIsEditing(true)}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {booksStrings.editButton}
                  </ThemedText>
                </Pressable>
                <Pressable onPress={handleDelete} disabled={deleteBook.isPending}>
                  <ThemedText type="small" style={styles.deleteText}>
                    {booksStrings.deleteButton}
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </>
          )}

          {details ? (
            <ThemedView style={styles.progressSection}>
              <ThemedText type="small" themeColor="textSecondary">
                {booksStrings.progressLabel}
                {details.total_pages
                  ? ` · ${booksStrings.currentPageOf(details.current_page, details.total_pages)}`
                  : ''}
              </ThemedText>
              <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: theme.backgroundSelected, width: `${Math.min(100, progressRatio * 100)}%` },
                  ]}
                />
              </View>
            </ThemedView>
          ) : null}

          {details ? (
            <ReadingTimer
              userId={session.user.id}
              sourceId={book.id}
              oldCurrentPage={details.current_page}
              hadStarted={!!details.started_at}
            />
          ) : null}

          {book.status !== 'done' ? (
            <Pressable
              style={[styles.markDoneButton, { backgroundColor: theme.backgroundSelected }]}
              onPress={() => markDone.mutate()}
              disabled={markDone.isPending}>
              <ThemedText type="small">{booksStrings.markDoneButton}</ThemedText>
            </Pressable>
          ) : null}

          <ThemedView style={styles.quotesSection}>
            <ThemedText type="smallBold">{booksStrings.quotesFromBookTitle}</ThemedText>
            <QuoteQuickAdd userId={session.user.id} sourceId={book.id} />
            {quotes && quotes.length > 0 ? (
              quotes.map((quote) => <QuoteListItem key={quote.id} quote={quote} sourceTitle={null} />)
            ) : (
              <ThemedText type="small" themeColor="textSecondary">
                {booksStrings.quotesEmpty}
              </ThemedText>
            )}
          </ThemedView>
        </ScrollView>
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
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
  },
  cover: {
    width: 90,
    height: 124,
    borderRadius: 8,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerText: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  editDeleteRow: {
    flexDirection: 'row',
    gap: 16,
  },
  deleteText: {
    color: '#D64545',
  },
  progressSection: {
    gap: 6,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  markDoneButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  quotesSection: {
    gap: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
