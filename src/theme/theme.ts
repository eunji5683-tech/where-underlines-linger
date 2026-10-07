/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#3A332E',
    background: '#FBF5EC',
    backgroundElement: '#F3E2DC',
    backgroundSelected: '#D9E7DC',
    textSecondary: '#8C8077',
  },
  dark: {
    text: '#F3ECE3',
    background: '#241F1B',
    backgroundElement: '#3A2F2B',
    backgroundSelected: '#36403A',
    textSecondary: '#B4A99F',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// 배경에 깔리는 번진 물감 느낌의 얼룩(watercolor wash) 색상.
// ScreenContainer에서 큰 반투명 원으로 그려 종이 위에 수채 물감이 스민 듯한 질감을 낸다.
export const WatercolorWash = {
  light: ['#F3C9B855', '#C9E3D355', '#C7D9EE55'] as const,
  dark: ['#5A3F3340', '#2E4A3C40', '#2C3C5240'] as const,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
