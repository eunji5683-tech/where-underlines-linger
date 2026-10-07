import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { BookWithDetails } from '@/features/books/api';
import { booksStrings } from '@/features/books/strings';
import { useUpdateBook } from '@/features/books/use-update-book';
import { useTheme } from '@/hooks/use-theme';

interface BookEditFormProps {
  userId: string;
  book: BookWithDetails;
  onDone: () => void;
}

export function BookEditForm({ userId, book, onDone }: BookEditFormProps) {
  const theme = useTheme();
  const [title, setTitle] = useState(book.title);
  const [creator, setCreator] = useState(book.creator ?? '');
  const [totalPages, setTotalPages] = useState(String(book.book_details?.total_pages ?? ''));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const updateBook = useUpdateBook(userId, book.id);

  async function handleSave() {
    if (!title.trim()) {
      setErrorMessage(booksStrings.titleRequired);
      return;
    }
    const pages = Number(totalPages);
    if (!totalPages.trim() || Number.isNaN(pages) || pages <= 0) {
      setErrorMessage(booksStrings.totalPagesRequired);
      return;
    }
    setErrorMessage(null);
    try {
      await updateBook.mutateAsync({
        sourceId: book.id,
        title: title.trim(),
        creator: creator.trim() || null,
        totalPages: pages,
      });
      onDone();
    } catch {
      setErrorMessage(booksStrings.updateError);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        {booksStrings.titleLabel}
      </ThemedText>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        value={title}
        onChangeText={setTitle}
      />

      <ThemedText type="small" themeColor="textSecondary">
        {booksStrings.creatorLabel}
      </ThemedText>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        value={creator}
        onChangeText={setCreator}
      />

      <ThemedText type="small" themeColor="textSecondary">
        {booksStrings.totalPagesLabel}
      </ThemedText>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        value={totalPages}
        onChangeText={setTotalPages}
        keyboardType="number-pad"
      />

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}

      <ThemedView style={styles.buttonRow}>
        <Pressable onPress={onDone} style={styles.cancelButton}>
          <ThemedText themeColor="textSecondary">{booksStrings.cancelButton}</ThemedText>
        </Pressable>
        <Pressable
          onPress={handleSave}
          disabled={updateBook.isPending}
          style={[styles.saveButton, { backgroundColor: theme.backgroundElement }]}>
          {updateBook.isPending ? (
            <ActivityIndicator />
          ) : (
            <ThemedText type="smallBold">{booksStrings.saveButton}</ThemedText>
          )}
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  error: {
    color: '#D64545',
  },
});
