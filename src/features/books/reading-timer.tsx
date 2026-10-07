import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { booksStrings } from '@/features/books/strings';
import { useLogReadingSession } from '@/features/books/use-log-reading-session';
import { useTheme } from '@/hooks/use-theme';

interface ReadingTimerProps {
  userId: string;
  sourceId: string;
  oldCurrentPage: number;
  hadStarted: boolean;
}

export function ReadingTimer({ userId, sourceId, oldCurrentPage, hadStarted }: ReadingTimerProps) {
  const theme = useTheme();
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [endedAt, setEndedAt] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const logSession = useLogReadingSession(userId, sourceId);

  function handleStart() {
    setStartedAt(new Date().toISOString());
    setEndedAt(null);
  }

  function handleEnd() {
    setEndedAt(new Date().toISOString());
  }

  async function handleSave() {
    const page = Number(pageInput);
    if (!pageInput.trim() || Number.isNaN(page)) {
      setErrorMessage(booksStrings.pageRequired);
      return;
    }
    if (page < oldCurrentPage) {
      setErrorMessage(booksStrings.pageTooSmall);
      return;
    }
    setErrorMessage(null);
    try {
      await logSession.mutateAsync({
        userId,
        sourceId,
        oldCurrentPage,
        newCurrentPage: page,
        startedAt: startedAt as string,
        endedAt: endedAt as string,
        hadStarted,
      });
      setStartedAt(null);
      setEndedAt(null);
      setPageInput('');
    } catch {
      setErrorMessage(booksStrings.sessionSaveError);
    }
  }

  if (!startedAt) {
    return (
      <Pressable style={[styles.button, { backgroundColor: theme.backgroundElement }]} onPress={handleStart}>
        <ThemedText type="smallBold">{booksStrings.timerStart}</ThemedText>
      </Pressable>
    );
  }

  if (!endedAt) {
    return (
      <ThemedView style={styles.runningBox}>
        <ThemedText themeColor="textSecondary">{booksStrings.timerRunning}</ThemedText>
        <Pressable style={[styles.button, { backgroundColor: theme.backgroundElement }]} onPress={handleEnd}>
          <ThemedText type="smallBold">{booksStrings.timerEnd}</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.endBox}>
      <ThemedText type="small">{booksStrings.currentPagePrompt}</ThemedText>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        value={pageInput}
        onChangeText={setPageInput}
        keyboardType="number-pad"
      />
      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        onPress={handleSave}
        disabled={logSession.isPending}>
        {logSession.isPending ? (
          <ActivityIndicator />
        ) : (
          <ThemedText type="smallBold">{booksStrings.sessionSaveButton}</ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  runningBox: {
    gap: 8,
    alignItems: 'flex-start',
  },
  endBox: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: 120,
  },
  error: {
    color: '#D64545',
  },
});
