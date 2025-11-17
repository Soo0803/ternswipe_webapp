/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { palette } from './theme';

const tintColorLight = palette.primary;
const tintColorDark = palette.primary;

export const Colors = {
  light: {
    text: palette.text,
    textMuted: palette.textMuted,
    background: palette.background,
    surface: palette.surface,
    surfaceMuted: palette.surfaceMuted,
    border: palette.border,
    tint: tintColorLight,
    icon: palette.textSubtle,
    tabIconDefault: palette.textSubtle,
    tabIconSelected: tintColorLight,
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
  },
  dark: {
    text: palette.text,
    textMuted: palette.textMuted,
    background: palette.background,
    surface: palette.surface,
    surfaceMuted: palette.surfaceMuted,
    border: palette.border,
    tint: tintColorDark,
    icon: palette.textSubtle,
    tabIconDefault: palette.textSubtle,
    tabIconSelected: tintColorDark,
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
  },
};
