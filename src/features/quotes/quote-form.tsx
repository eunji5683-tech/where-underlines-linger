import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SourcePicker } from '@/features/sources/source-picker';
import { quotesStrings } from '@/features/quotes/strings';
import { useCreateQuote } from '@/features/quotes/use-create-quote';
import { useTheme } from '@/hooks/use-theme';

interface QuoteFormProps {
  userId: string;
}

export function QuoteForm({ userId }: QuoteFormProps) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const createQuote = useCreateQuote(userId);

  async function handleSave() {
    if (!text.trim()) {
      setErrorMessage(quotesStrings.textRequired);
      return;
    }
    setErrorMessage(null);
    setSavedMessage(null);
    try {
      await createQuote.mutateAsync({ userId, text: text.trim(), sourceId });
      setText('');
      setSourceId(null);
      setSavedMessage(quotesStrings.saved);
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
        numberOfLines={4}
      />

      <SourcePicker userId={userId} selectedSourceId={sourceId} onSelect={setSourceId} />

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      {savedMessage ? <ThemedText style={styles.saved}>{savedMessage}</ThemedText> : null}

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
