import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSources } from '@/features/sources/use-sources';
import { useTheme } from '@/hooks/use-theme';

interface SourceFilterProps {
  userId: string;
  selectedSourceId: string | null;
  onSelect: (sourceId: string | null) => void;
}

export function SourceFilter({ userId, selectedSourceId, onSelect }: SourceFilterProps) {
  const theme = useTheme();
  const { data: sources } = useSources(userId);

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
      <Pressable
        onPress={() => onSelect(null)}
        style={[
          styles.chip,
          { backgroundColor: selectedSourceId === null ? theme.backgroundSelected : theme.backgroundElement },
        ]}>
        <ThemedText type="small">전체</ThemedText>
      </Pressable>

      {sources.map((source) => (
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 0,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
});
