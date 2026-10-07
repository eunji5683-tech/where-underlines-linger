import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { AuthForm } from '@/features/auth/auth-form';
import { authStrings } from '@/features/auth/strings';
import { useSession } from '@/features/auth/use-session';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const theme = useTheme();
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
      <ScreenContainer>
        <AuthForm />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <ThemedText type="title">나</ThemedText>
      <ThemedText>{session.user.email}</ThemedText>
      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        onPress={() => supabase.auth.signOut()}>
        <ThemedText type="smallBold">{authStrings.signOutButton}</ThemedText>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
});
