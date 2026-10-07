import { ActivityIndicator, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/features/auth/use-session';
import { QuoteForm } from '@/features/quotes/quote-form';
import { quotesStrings } from '@/features/quotes/strings';

export default function AddScreen() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <ScreenContainer style={styles.centered}>
        <ActivityIndicator />
      </ScreenContainer>
    );
  }

  if (!session) {
    return (
      <ScreenContainer style={styles.centered}>
        <ThemedText themeColor="textSecondary">{quotesStrings.loginRequired}</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <QuoteForm userId={session.user.id} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
