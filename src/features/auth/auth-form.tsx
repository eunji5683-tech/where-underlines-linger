import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getAuthErrorMessage } from '@/features/auth/get-auth-error-message';
import { authStrings } from '@/features/auth/strings';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/use-theme';

export function AuthForm() {
  const theme = useTheme();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setErrorMessage(null);

    const { error } =
      mode === 'signUp'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
    }
    setSubmitting(false);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        {mode === 'signUp' ? authStrings.signUpTitle : authStrings.signInTitle}
      </ThemedText>

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        placeholder={authStrings.emailLabel}
        placeholderTextColor={theme.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        placeholder={authStrings.passwordLabel}
        placeholderTextColor={theme.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}

      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        onPress={handleSubmit}
        disabled={submitting}>
        {submitting ? (
          <ActivityIndicator />
        ) : (
          <ThemedText type="smallBold">
            {mode === 'signUp' ? authStrings.signUpButton : authStrings.signInButton}
          </ThemedText>
        )}
      </Pressable>

      <Pressable onPress={() => setMode(mode === 'signUp' ? 'signIn' : 'signUp')}>
        <ThemedText type="link" themeColor="textSecondary">
          {mode === 'signUp' ? authStrings.switchToSignIn : authStrings.switchToSignUp}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  error: {
    color: '#D64545',
  },
});
