import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/features/auth/use-session';
import { QuoteForm } from '@/features/quotes/quote-form';
import { quotesStrings } from '@/features/quotes/strings';

export default function AddScreen() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!session) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">{quotesStrings.loginRequired}</ThemedText>
      </ThemedView>
    );
  }

  return <QuoteForm userId={session.user.id} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
