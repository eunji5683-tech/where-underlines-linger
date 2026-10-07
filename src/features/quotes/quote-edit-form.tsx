import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { quotesStrings } from '@/features/quotes/strings';
import { useUpdateQuote } from '@/features/quotes/use-update-quote';
import { SourcePicker } from '@/features/sources/source-picker';
import { useTheme } from '@/hooks/use-theme';
import type { Quote } from '@/types/database';

interface QuoteEditFormProps {
  userId: string;
  quote: Quote;
}

export function QuoteEditForm({ userId, quote }: QuoteEditFormProps) {
  const theme = useTheme();
  const [text, setText] = useState(quote.text);
  const [sourceId, setSourceId] = useState<string | null>(quote.source_id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const updateQuote = useUpdateQuote(userId);

  async function handleSave() {
    if (!text.trim()) {
      setErrorMessage(quotesStrings.textRequired);
      return;
    }
    setErrorMessage(null);
    setSavedMessage(null);
    try {
      await updateQuote.mutateAsync({ id: quote.id, text: text.trim(), sourceId });
      setSavedMessage(quotesStrings.updated);
    } catch {
      setErrorMessage(quotesStrings.updateError);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={4}
      />

      <SourcePicker userId={userId} selectedSourceId={sourceId} onSelect={setSourceId} />

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      {savedMessage ? <ThemedText style={styles.saved}>{savedMessage}</ThemedText> : null}

      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        onPress={handleSave}
        disabled={updateQuote.isPending}>
        {updateQuote.isPending ? (
          <ActivityIndicator />
        ) : (
          <ThemedText type="smallBold">{quotesStrings.updateButton}</ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  error: {
    color: '#D64545',
  },
  saved: {
    color: '#2E8B57',
  },
});
