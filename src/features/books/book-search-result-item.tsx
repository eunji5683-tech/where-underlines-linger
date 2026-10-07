import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { BookSearchResult } from '@/features/books/kakao-api';

interface BookSearchResultItemProps {
  book: BookSearchResult;
  onPress: () => void;
}

export function BookSearchResultItem({ book, onPress }: BookSearchResultItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.cover}>
        {book.coverUrl ? (
          <Image source={{ uri: book.coverUrl }} style={styles.coverImage} contentFit="cover" />
        ) : null}
      </ThemedView>
      <ThemedView style={styles.text}>
        <ThemedText numberOfLines={2}>{book.title}</ThemedText>
        {book.author ? (
          <ThemedText type="small" themeColor="textSecondary">
            {book.author}
          </ThemedText>
        ) : null}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  cover: {
    width: 50,
    height: 70,
    borderRadius: 6,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  text: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
});
