import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/features/auth/use-session';
import { QuoteEditForm } from '@/features/quotes/quote-edit-form';
import { quotesStrings } from '@/features/quotes/strings';
import { useQuote } from '@/features/quotes/use-quote';
import { ThoughtList } from '@/features/thoughts/thought-list';

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session, loading: sessionLoading } = useSession();
  const { data: quote, isLoading: quoteLoading, isError } = useQuote(id);

  const loading = sessionLoading || quoteLoading;

  return (
    <ScreenContainer style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ThemedText>{quotesStrings.back}</ThemedText>
      </Pressable>

      {loading ? (
        <ThemedView style={styles.centered}>
          <ActivityIndicator />
        </ThemedView>
      ) : !session ? (
        <ThemedView style={styles.centered}>
          <ThemedText themeColor="textSecondary">{quotesStrings.loginRequired}</ThemedText>
        </ThemedView>
      ) : isError || !quote ? (
        <ThemedView style={styles.centered}>
          <ThemedText themeColor="textSecondary">{quotesStrings.notFound}</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            {quotesStrings.editTitle}
          </ThemedText>
          <QuoteEditForm userId={session.user.id} quote={quote} />
          <ThemedView style={styles.thoughtSection}>
            <ThoughtList userId={session.user.id} quoteId={quote.id} />
          </ThemedView>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  thoughtSection: {
    paddingHorizontal: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
