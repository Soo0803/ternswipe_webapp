import { Dimensions, Platform } from 'react-native';
import { isWeb } from './platform';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (mobile-first, iPhone 12/13)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Responsive scaling function
export const scale = (size: number): number => {
  if (isWeb) {
    // On web, use viewport-based scaling with max constraints
    const vw = Math.min(SCREEN_WIDTH, 1440); // Max container width
    return (vw / BASE_WIDTH) * size;
  }
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export const verticalScale = (size: number): number => {
  if (isWeb) {
    const vh = Math.min(SCREEN_HEIGHT, 900); // Max container height
    return (vh / BASE_HEIGHT) * size;
  }
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Container max width for web
export const getMaxWidth = (): number => {
  if (isWeb) {
    return Math.min(SCREEN_WIDTH * 0.9, 1200);
  }
  return SCREEN_WIDTH;
};

// Responsive font sizes
export const getFontSize = (size: number): number => {
  if (isWeb) {
    // Web: use rem-like scaling but with constraints
    const scaleFactor = Math.min(SCREEN_WIDTH / BASE_WIDTH, 1.5);
    return size * scaleFactor;
  }
  return moderateScale(size, 0.3);
};

// Responsive padding
export const getPadding = (size: number): number => {
  return moderateScale(size, 0.5);
};

// Check if device is tablet or desktop
export const isTabletOrDesktop = (): boolean => {
  if (isWeb) {
    return SCREEN_WIDTH >= 768;
  }
  return SCREEN_WIDTH >= 768;
};

