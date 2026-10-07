import { SafeAreaView } from 'react-native-safe-area-context';
import type { ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function ScreenContainer({ style, ...props }: ViewProps) {
  const theme = useTheme();
  return (
    <SafeAreaView
      edges={['top']}
      style={[{ flex: 1, backgroundColor: theme.background }, style]}
      {...props}
    />
  );
}
