import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">나</ThemedText>
      <ThemedText>{session.user.email}</ThemedText>
      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        onPress={() => supabase.auth.signOut()}>
        <ThemedText type="smallBold">{authStrings.signOutButton}</ThemedText>
      </Pressable>
    </ThemedView>
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
