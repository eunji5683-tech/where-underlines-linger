import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ViewProps } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { WatercolorWash } from '@/theme/theme';

export function ScreenContainer({ style, children, ...props }: ViewProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const wash = WatercolorWash[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.washLayer}>
        <View style={[styles.blob, styles.blobOne, { backgroundColor: wash[0] }]} />
        <View style={[styles.blob, styles.blobTwo, { backgroundColor: wash[1] }]} />
        <View style={[styles.blob, styles.blobThree, { backgroundColor: wash[2] }]} />
      </View>
      {Platform.OS === 'web' ? (
        <View style={[{ flex: 1 }, style]} {...props}>
          {children}
        </View>
      ) : (
        <Pressable style={[{ flex: 1 }, style]} onPress={Keyboard.dismiss} {...props}>
          {children}
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  washLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
  },
  blobOne: {
    width: 320,
    height: 320,
    top: -80,
    right: -100,
  },
  blobTwo: {
    width: 280,
    height: 280,
    top: 280,
    left: -120,
  },
  blobThree: {
    width: 260,
    height: 260,
    bottom: -100,
    right: -60,
  },
});
