import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { thoughtsStrings } from '@/features/thoughts/strings';
import { useCreateThought } from '@/features/thoughts/use-create-thought';
import { useTheme } from '@/hooks/use-theme';

interface MomentInputProps {
  userId: string;
}

export function MomentInput({ userId }: MomentInputProps) {
  const theme = useTheme();
  const [body, setBody] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createThought = useCreateThought(userId);

  async function handleSave() {
    if (!body.trim()) {
      setErrorMessage(thoughtsStrings.bodyRequired);
      return;
    }
    setErrorMessage(null);
    try {
      await createThought.mutateAsync({ userId, quoteId: null, body: body.trim() });
      setBody('');
    } catch {
      setErrorMessage(thoughtsStrings.saveError);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="smallBold">{thoughtsStrings.momentTitle}</ThemedText>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        placeholder={thoughtsStrings.momentPlaceholder}
        placeholderTextColor={theme.textSecondary}
        value={body}
        onChangeText={setBody}
        multiline
      />
      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        onPress={handleSave}
        disabled={createThought.isPending}>
        {createThought.isPending ? (
          <ActivityIndicator />
        ) : (
          <ThemedText type="smallBold">{thoughtsStrings.addButton}</ThemedText>
        )}
      </Pressable>
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
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  error: {
    color: '#D64545',
  },
});
