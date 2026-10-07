import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { thoughtsStrings } from '@/features/thoughts/strings';
import { useCreateThought } from '@/features/thoughts/use-create-thought';
import { useThoughtsForQuote } from '@/features/thoughts/use-thoughts-for-quote';
import { useTheme } from '@/hooks/use-theme';

interface ThoughtListProps {
  userId: string;
  quoteId: string;
}

export function ThoughtList({ userId, quoteId }: ThoughtListProps) {
  const theme = useTheme();
  const { data: thoughts, isLoading, isError } = useThoughtsForQuote(quoteId);
  const createThought = useCreateThought(userId);
  const [body, setBody] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAdd() {
    if (!body.trim()) {
      setErrorMessage(thoughtsStrings.bodyRequired);
      return;
    }
    setErrorMessage(null);
    try {
      await createThought.mutateAsync({ userId, quoteId, body: body.trim() });
      setBody('');
    } catch {
      setErrorMessage(thoughtsStrings.saveError);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="smallBold">{thoughtsStrings.sectionTitle}</ThemedText>

      {isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ThemedText style={styles.error}>{thoughtsStrings.loadError}</ThemedText>
      ) : thoughts && thoughts.length > 0 ? (
        thoughts.map((thought) => (
          <ThemedView key={thought.id} type="backgroundElement" style={styles.thoughtItem}>
            <ThemedText type="small">{thought.body}</ThemedText>
          </ThemedView>
        ))
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          {thoughtsStrings.empty}
        </ThemedText>
      )}

      <ThemedView style={styles.addRow}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
          placeholder={thoughtsStrings.placeholder}
          placeholderTextColor={theme.textSecondary}
          value={body}
          onChangeText={setBody}
          multiline
        />
        <Pressable
          style={[styles.addButton, { backgroundColor: theme.backgroundElement }]}
          onPress={handleAdd}
          disabled={createThought.isPending}>
          {createThought.isPending ? (
            <ActivityIndicator />
          ) : (
            <ThemedText type="smallBold">{thoughtsStrings.addButton}</ThemedText>
          )}
        </Pressable>
      </ThemedView>
      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  thoughtItem: {
    borderRadius: 10,
    padding: 10,
  },
  addRow: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  error: {
    color: '#D64545',
  },
});
