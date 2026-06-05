import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const IS_WEB = Platform.OS === 'web';
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_SCREEN = width < 380;

// Minimum touch target size (Apple HIG: 44pt)
export const MIN_TOUCH_SIZE = 44;

// Safe bottom padding for iOS home indicator
export const SAFE_BOTTOM = IS_WEB ? 0 : 34;
