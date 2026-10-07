import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { WatchSourceType } from '@/features/sources/api';
import { sourceTypeLabels, watchStrings } from '@/features/sources/strings';
import { useCreateWatchSource } from '@/features/sources/use-create-watch-source';
import { useTheme } from '@/hooks/use-theme';
import type { SourceStatus } from '@/types/database';

const WATCH_TYPES: WatchSourceType[] = ['drama', 'movie', 'tv'];
const STATUSES: { status: SourceStatus; label: string }[] = [
  { status: 'wish', label: watchStrings.statusWish },
  { status: 'ongoing', label: watchStrings.statusOngoing },
  { status: 'done', label: watchStrings.statusDone },
];

interface WatchFormProps {
  userId: string;
  onDone: () => void;
}

export function WatchForm({ userId, onDone }: WatchFormProps) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<WatchSourceType>('drama');
  const [status, setStatus] = useState<SourceStatus>('wish');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createWatchSource = useCreateWatchSource(userId);

  async function handleSave() {
    if (!title.trim()) {
      setErrorMessage(watchStrings.titleRequired);
      return;
    }
    setErrorMessage(null);
    try {
      await createWatchSource.mutateAsync({ userId, title: title.trim(), type, status });
      onDone();
    } catch {
      setErrorMessage(watchStrings.saveError);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        placeholder={watchStrings.titleLabel}
        placeholderTextColor={theme.textSecondary}
        value={title}
        onChangeText={setTitle}
      />

      <ThemedText type="small" themeColor="textSecondary">
        {watchStrings.typeLabel}
      </ThemedText>
      <ThemedView style={styles.chipRow}>
        {WATCH_TYPES.map((watchType) => (
          <Pressable
            key={watchType}
            onPress={() => setType(watchType)}
            style={[
              styles.chip,
              { backgroundColor: type === watchType ? theme.backgroundSelected : theme.backgroundElement },
            ]}>
            <ThemedText type="small">{sourceTypeLabels[watchType]}</ThemedText>
          </Pressable>
        ))}
      </ThemedView>

      <ThemedText type="small" themeColor="textSecondary">
        {watchStrings.statusLabel}
      </ThemedText>
      <ThemedView style={styles.chipRow}>
        {STATUSES.map((item) => (
          <Pressable
            key={item.status}
            onPress={() => setStatus(item.status)}
            style={[
              styles.chip,
              { backgroundColor: status === item.status ? theme.backgroundSelected : theme.backgroundElement },
            ]}>
            <ThemedText type="small">{item.label}</ThemedText>
          </Pressable>
        ))}
      </ThemedView>

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}

      <ThemedView style={styles.buttonRow}>
        <Pressable onPress={onDone} style={styles.cancelButton}>
          <ThemedText themeColor="textSecondary">{watchStrings.cancelButton}</ThemedText>
        </Pressable>
        <Pressable
          onPress={handleSave}
          disabled={createWatchSource.isPending}
          style={[styles.saveButton, { backgroundColor: theme.backgroundElement }]}>
          {createWatchSource.isPending ? (
            <ActivityIndicator />
          ) : (
            <ThemedText type="smallBold">{watchStrings.saveButton}</ThemedText>
          )}
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  error: {
    color: '#D64545',
  },
});
