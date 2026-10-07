import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { booksStrings } from '@/features/books/strings';
import type { BookWithDetails } from '@/features/books/api';

interface BookCardProps {
  book: BookWithDetails;
}

export function BookCard({ book }: BookCardProps) {
  const details = book.book_details;
  const progressText =
    details && details.total_pages
      ? booksStrings.currentPageOf(details.current_page, details.total_pages)
      : null;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/book/[id]', params: { id: book.id } })}
      style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.cover}>
        {book.cover_url ? (
          <Image source={{ uri: book.cover_url }} style={styles.coverImage} contentFit="cover" />
        ) : null}
      </ThemedView>
      <ThemedText type="small" numberOfLines={2}>
        {book.title}
      </ThemedText>
      {progressText ? (
        <ThemedText type="small" themeColor="textSecondary">
          {progressText}
        </ThemedText>
      ) : null}
    </Pressable>
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
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
});
