import { Dimensions, Platform, StatusBar } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// iPhone models with notch/dynamic island
const IPHONE_X_HEIGHT = 812;
const IPHONE_XR_HEIGHT = 896;
const IPHONE_12_MINI_HEIGHT = 780;
const IPHONE_12_HEIGHT = 844;
const IPHONE_12_PRO_MAX_HEIGHT = 926;
const IPHONE_14_PRO_HEIGHT = 852;
const IPHONE_14_PRO_MAX_HEIGHT = 932;

export const hasNotch = (): boolean => {
  if (Platform.OS !== 'ios') return false;
  
  return [
    IPHONE_X_HEIGHT,
    IPHONE_XR_HEIGHT,
    IPHONE_12_MINI_HEIGHT,
    IPHONE_12_HEIGHT,
    IPHONE_12_PRO_MAX_HEIGHT,
    IPHONE_14_PRO_HEIGHT,
    IPHONE_14_PRO_MAX_HEIGHT,
  ].includes(screenHeight);
};

export const getStatusBarHeight = (): number => {
  if (Platform.OS === 'ios') {
    return hasNotch() ? 44 : 20;
  }
  return StatusBar.currentHeight || 24;
};

export const getBottomSafeAreaHeight = (): number => {
  if (Platform.OS === 'ios' && hasNotch()) {
    return 34;
  }
  return 0;
};

export const getSafeAreaInsets = () => ({
  top: getStatusBarHeight(),
  bottom: getBottomSafeAreaHeight(),
  left: 0,
  right: 0,
});

export const withSafeArea = (style: any) => ({
  ...style,
  paddingTop: (style.paddingTop || 0) + getStatusBarHeight(),
  paddingBottom: (style.paddingBottom || 0) + getBottomSafeAreaHeight(),
});
