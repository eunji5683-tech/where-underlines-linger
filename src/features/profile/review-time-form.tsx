import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  ensureNotificationPermission,
  scheduleDailyReviewReminder,
} from '@/features/notifications/api';
import { profileStrings } from '@/features/profile/strings';
import { useProfile } from '@/features/profile/use-profile';
import { useUpdateReviewTime } from '@/features/profile/use-update-review-time';
import { useTheme } from '@/hooks/use-theme';

interface ReviewTimeFormProps {
  userId: string;
}

export function ReviewTimeForm({ userId }: ReviewTimeFormProps) {
  const theme = useTheme();
  const { data: profile, isLoading } = useProfile(userId);
  const updateReviewTime = useUpdateReviewTime(userId);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [h, m] = (profile?.review_time ?? '21:00').split(':');
  const hourValue = hour || h;
  const minuteValue = minute || m;

  async function handleSave() {
    const hourNum = Number(hourValue);
    const minuteNum = Number(minuteValue);

    if (Number.isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
      setErrorMessage(profileStrings.hourInvalid);
      return;
    }
    if (Number.isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
      setErrorMessage(profileStrings.minuteInvalid);
      return;
    }

    setErrorMessage(null);
    setSavedMessage(null);
    const reviewTime = `${String(hourNum).padStart(2, '0')}:${String(minuteNum).padStart(2, '0')}:00`;

    try {
      await updateReviewTime.mutateAsync({ userId, reviewTime });
      const granted = await ensureNotificationPermission();
      if (granted) {
        await scheduleDailyReviewReminder({ hour: hourNum, minute: minuteNum });
      }
      setSavedMessage(profileStrings.saved);
    } catch {
      setErrorMessage(profileStrings.saveError);
    }
  }

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="smallBold">{profileStrings.reviewTimeTitle}</ThemedText>

      <ThemedView style={styles.row}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
          value={hourValue}
          onChangeText={setHour}
          keyboardType="number-pad"
          maxLength={2}
        />
        <ThemedText>{profileStrings.hourLabel}</ThemedText>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
          value={minuteValue}
          onChangeText={setMinute}
          keyboardType="number-pad"
          maxLength={2}
        />
        <ThemedText>{profileStrings.minuteLabel}</ThemedText>
      </ThemedView>

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      {savedMessage ? <ThemedText style={styles.saved}>{savedMessage}</ThemedText> : null}

      <Pressable
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
        onPress={handleSave}
        disabled={updateReviewTime.isPending}>
        {updateReviewTime.isPending ? (
          <ActivityIndicator />
        ) : (
          <ThemedText type="smallBold">{profileStrings.saveButton}</ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    width: 48,
    textAlign: 'center',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  error: {
    color: '#D64545',
  },
  saved: {
    color: '#2E8B57',
  },
});
