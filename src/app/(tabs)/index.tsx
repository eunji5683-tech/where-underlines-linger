import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/features/auth/use-session';
import { quotesStrings } from '@/features/quotes/strings';
import { MomentInput } from '@/features/thoughts/moment-input';
import { UnlinkedThoughtList } from '@/features/thoughts/unlinked-thought-list';

export default function HomeScreen() {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">홈</ThemedText>
      <MomentInput userId={session.user.id} />
      <UnlinkedThoughtList userId={session.user.id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
