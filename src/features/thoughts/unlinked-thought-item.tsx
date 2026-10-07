import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { QuotePicker } from '@/features/thoughts/quote-picker';
import { thoughtsStrings } from '@/features/thoughts/strings';
import { useLinkThought } from '@/features/thoughts/use-link-thought';
import { useTheme } from '@/hooks/use-theme';
import type { Thought } from '@/types/database';

interface UnlinkedThoughtItemProps {
  userId: string;
  thought: Thought;
}

export function UnlinkedThoughtItem({ userId, thought }: UnlinkedThoughtItemProps) {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const linkThought = useLinkThought(userId);

  async function handleSelect(quoteId: string) {
    setErrorMessage(null);
    try {
      await linkThought.mutateAsync({ thoughtId: thought.id, quoteId });
      setShowPicker(false);
    } catch {
      setErrorMessage(thoughtsStrings.linkError);
    }
  }

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="small">{thought.body}</ThemedText>

      {showPicker ? (
        <>
          <ThemedText type="small" themeColor="textSecondary">
            {thoughtsStrings.linkPickerTitle}
          </ThemedText>
          <QuotePicker userId={userId} onSelect={handleSelect} />
          <Pressable onPress={() => setShowPicker(false)}>
            <ThemedText type="small" themeColor="textSecondary">
              {thoughtsStrings.cancelButton}
            </ThemedText>
          </Pressable>
        </>
      ) : (
        <Pressable
          onPress={() => setShowPicker(true)}
          style={[styles.linkButton, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="small">{thoughtsStrings.linkButton}</ThemedText>
        </Pressable>
      )}

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  linkButton: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  error: {
    color: '#D64545',
  },
});
