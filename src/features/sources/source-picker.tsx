import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SourceForm } from '@/features/sources/source-form';
import { sourcesStrings } from '@/features/sources/strings';
import { useSources } from '@/features/sources/use-sources';
import { useTheme } from '@/hooks/use-theme';
import type { Source } from '@/types/database';

interface SourcePickerProps {
  userId: string;
  selectedSourceId: string | null;
  onSelect: (sourceId: string | null) => void;
}

export function SourcePicker({ userId, selectedSourceId, onSelect }: SourcePickerProps) {
  const theme = useTheme();
  const { data: sources, isLoading, isError } = useSources(userId);
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return <ThemedText style={styles.error}>{sourcesStrings.loadError}</ThemedText>;
  }

  if (showForm) {
    return (
      <SourceForm
        userId={userId}
        onCancel={() => setShowForm(false)}
        onCreated={(source: Source) => {
          setShowForm(false);
          onSelect(source.id);
        }}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        {sourcesStrings.pickerTitle}
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Pressable
          onPress={() => onSelect(null)}
          style={[
            styles.chip,
            { backgroundColor: selectedSourceId === null ? theme.backgroundSelected : theme.backgroundElement },
          ]}>
          <ThemedText type="small">{sourcesStrings.none}</ThemedText>
        </Pressable>

        {sources?.map((source) => (
          <Pressable
            key={source.id}
            onPress={() => onSelect(source.id)}
            style={[
              styles.chip,
              {
                backgroundColor:
                  selectedSourceId === source.id ? theme.backgroundSelected : theme.backgroundElement,
              },
            ]}>
            <ThemedText type="small">{source.title}</ThemedText>
          </Pressable>
        ))}

        <Pressable onPress={() => setShowForm(true)} style={styles.chip}>
          <ThemedText type="small" themeColor="textSecondary">
            {sourcesStrings.addNew}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  error: {
    color: '#D64545',
  },
});
