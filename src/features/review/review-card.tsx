import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDueQuote } from '@/features/review/use-due-quote';
import { useSubmitReview } from '@/features/review/use-submit-review';
import { reviewStrings } from '@/features/review/strings';
import { ThoughtList } from '@/features/thoughts/thought-list';
import { useTheme } from '@/hooks/use-theme';
import type { ReviewResult } from '@/types/database';

interface ReviewCardProps {
  userId: string;
}

export function ReviewCard({ userId }: ReviewCardProps) {
  const theme = useTheme();
  const { data: due, isLoading, isError } = useDueQuote(userId);
  const submitReview = useSubmitReview(userId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleResult(result: ReviewResult) {
    if (!due) return;
    setErrorMessage(null);
    try {
      await submitReview.mutateAsync({
        quoteId: due.quoteId,
        currentIntervalDays: due.intervalDays,
        currentReviewCount: due.reviewCount,
        result,
      });
    } catch {
      setErrorMessage(reviewStrings.submitError);
    }
  }

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold">{reviewStrings.cardTitle}</ThemedText>

      {isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ThemedText style={styles.error}>{reviewStrings.loadError}</ThemedText>
      ) : due ? (
        <>
          <ThemedText>{due.quote.text}</ThemedText>
          <ThemedView style={styles.buttonRow}>
            <Pressable
              style={[styles.button, { backgroundColor: theme.background }]}
              onPress={() => handleResult('again')}
              disabled={submitReview.isPending}>
              <ThemedText type="smallBold">{reviewStrings.againButton}</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: theme.backgroundSelected }]}
              onPress={() => handleResult('remembered')}
              disabled={submitReview.isPending}>
              <ThemedText type="smallBold">{reviewStrings.rememberedButton}</ThemedText>
            </Pressable>
          </ThemedView>
          {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
          <ThoughtList userId={userId} quoteId={due.quoteId} />
        </>
      ) : (
        <ThemedText themeColor="textSecondary">{reviewStrings.empty}</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  error: {
    color: '#D64545',
  },
});
