import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/features/auth/use-session';
import { useSyncDailyReminder } from '@/features/notifications/use-sync-daily-reminder';
import { useProfile } from '@/features/profile/use-profile';
import { quotesStrings } from '@/features/quotes/strings';
import { ReviewCard } from '@/features/review/review-card';
import { MomentInput } from '@/features/thoughts/moment-input';
import { UnlinkedThoughtList } from '@/features/thoughts/unlinked-thought-list';

export default function HomeScreen() {
  const { session, loading } = useSession();
  const { data: profile } = useProfile(session?.user.id);
  useSyncDailyReminder(profile);

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
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title">홈</ThemedText>
        <ReviewCard userId={session.user.id} />
        <MomentInput userId={session.user.id} />
        <UnlinkedThoughtList userId={session.user.id} />
      </ScrollView>
    </ScreenContainer>
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
