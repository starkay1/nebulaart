import 'react-native-gesture-handler/jestSetup';

// Mock react-native modules
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

// Mock expo modules
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
  SafeAreaProvider: 'SafeAreaProvider',
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    onLine: true,
    share: jest.fn(),
    clipboard: {
      writeText: jest.fn(),
    },
  },
  writable: true,
});

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
