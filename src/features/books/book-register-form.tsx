import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { BookSearchResult } from '@/features/books/kakao-api';
import { booksStrings } from '@/features/books/strings';
import { useCreateBook } from '@/features/books/use-create-book';
import { useTheme } from '@/hooks/use-theme';

interface BookRegisterFormProps {
  userId: string;
  book: BookSearchResult;
}

export function BookRegisterForm({ userId, book }: BookRegisterFormProps) {
  const theme = useTheme();
  const [totalPages, setTotalPages] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createBook = useCreateBook(userId);

  async function handleRegister(status: 'wish' | 'ongoing') {
    const pages = Number(totalPages);
    if (!totalPages.trim() || Number.isNaN(pages) || pages <= 0) {
      setErrorMessage(booksStrings.totalPagesRequired);
      return;
    }
    setErrorMessage(null);
    try {
      await createBook.mutateAsync({
        userId,
        title: book.title,
        creator: book.author,
        coverUrl: book.coverUrl,
        externalId: book.isbn,
        status,
        totalPages: pages,
      });
      router.back();
    } catch {
      setErrorMessage(booksStrings.registerError);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.preview}>
        <ThemedView type="backgroundElement" style={styles.cover}>
          {book.coverUrl ? (
            <Image source={{ uri: book.coverUrl }} style={styles.coverImage} contentFit="cover" />
          ) : null}
        </ThemedView>
        <ThemedView style={styles.previewText}>
          <ThemedText>{book.title}</ThemedText>
          {book.author ? (
            <ThemedText type="small" themeColor="textSecondary">
              {book.author}
            </ThemedText>
          ) : null}
        </ThemedView>
      </ThemedView>

      <ThemedText type="small" themeColor="textSecondary">
        {booksStrings.totalPagesLabel}
      </ThemedText>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        placeholder={booksStrings.totalPagesPlaceholder}
        placeholderTextColor={theme.textSecondary}
        value={totalPages}
        onChangeText={setTotalPages}
        keyboardType="number-pad"
      />

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}

      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        onPress={() => handleRegister('ongoing')}
        disabled={createBook.isPending}>
        {createBook.isPending ? (
          <ActivityIndicator />
        ) : (
          <ThemedText type="smallBold">{booksStrings.registerAsOngoing}</ThemedText>
        )}
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundSelected }]}
        onPress={() => handleRegister('wish')}
        disabled={createBook.isPending}>
        <ThemedText type="smallBold">{booksStrings.registerAsWish}</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  preview: {
    flexDirection: 'row',
    gap: 12,
  },
  cover: {
    width: 70,
    height: 96,
    borderRadius: 6,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  previewText: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  error: {
    color: '#D64545',
  },
});
