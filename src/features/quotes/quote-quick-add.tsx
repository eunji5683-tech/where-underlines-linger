import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { quotesStrings } from '@/features/quotes/strings';
import { useCreateQuote } from '@/features/quotes/use-create-quote';
import { useTheme } from '@/hooks/use-theme';

interface QuoteQuickAddProps {
  userId: string;
  sourceId: string;
}

export function QuoteQuickAdd({ userId, sourceId }: QuoteQuickAddProps) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createQuote = useCreateQuote(userId);

  async function handleSave() {
    if (!text.trim()) {
      setErrorMessage(quotesStrings.textRequired);
      return;
    }
    setErrorMessage(null);
    try {
      await createQuote.mutateAsync({ userId, text: text.trim(), sourceId });
      setText('');
    } catch {
      setErrorMessage(quotesStrings.saveError);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        placeholder={quotesStrings.textPlaceholder}
        placeholderTextColor={theme.textSecondary}
        value={text}
        onChangeText={setText}
        multiline
      />
      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        onPress={handleSave}
        disabled={createQuote.isPending}>
        {createQuote.isPending ? (
          <ActivityIndicator />
        ) : (
          <ThemedText type="smallBold">{quotesStrings.saveButton}</ThemedText>
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
