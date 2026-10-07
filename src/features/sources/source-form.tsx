import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCreateSource } from '@/features/sources/use-create-source';
import { sourceTypeLabels, sourcesStrings } from '@/features/sources/strings';
import { useTheme } from '@/hooks/use-theme';
import type { Source, SourceType } from '@/types/database';

const SOURCE_TYPES = Object.keys(sourceTypeLabels) as SourceType[];

interface SourceFormProps {
  userId: string;
  onCreated: (source: Source) => void;
  onCancel: () => void;
}

export function SourceForm({ userId, onCreated, onCancel }: SourceFormProps) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<SourceType>('book');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createSource = useCreateSource(userId);

  async function handleSave() {
    if (!title.trim()) {
      setErrorMessage(sourcesStrings.titleRequired);
      return;
    }
    setErrorMessage(null);
    try {
      const source = await createSource.mutateAsync({ userId, title: title.trim(), type });
      onCreated(source);
    } catch {
      setErrorMessage(sourcesStrings.saveError);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        placeholder={sourcesStrings.titleLabel}
        placeholderTextColor={theme.textSecondary}
        value={title}
        onChangeText={setTitle}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeRow}>
        {SOURCE_TYPES.map((sourceType) => (
          <Pressable
            key={sourceType}
            onPress={() => setType(sourceType)}
            style={[
              styles.typeChip,
              {
                backgroundColor: sourceType === type ? theme.backgroundSelected : theme.backgroundElement,
              },
            ]}>
            <ThemedText type="small">{sourceTypeLabels[sourceType]}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}

      <ThemedView style={styles.buttonRow}>
        <Pressable onPress={onCancel} style={styles.cancelButton}>
          <ThemedText themeColor="textSecondary">{sourcesStrings.cancelButton}</ThemedText>
        </Pressable>
        <Pressable
          onPress={handleSave}
          disabled={createSource.isPending}
          style={[styles.saveButton, { backgroundColor: theme.backgroundElement }]}>
          {createSource.isPending ? (
            <ActivityIndicator />
          ) : (
            <ThemedText type="smallBold">{sourcesStrings.saveButton}</ThemedText>
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
  typeRow: {
    flexGrow: 0,
  },
  typeChip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
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
