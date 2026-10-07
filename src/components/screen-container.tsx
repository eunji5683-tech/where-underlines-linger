import { Keyboard, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function ScreenContainer({ style, children, ...props }: ViewProps) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      <Pressable style={[{ flex: 1 }, style]} onPress={Keyboard.dismiss} {...props}>
        {children}
      </Pressable>
    </SafeAreaView>
  );
}
