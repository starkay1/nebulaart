import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, AccessibilityInfo, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from './theme/theme';
import { HomePage } from './screens/HomePage';
import { CurationCenterPage } from './screens/CurationCenterPage';
import { ArtistHubPage } from './screens/ArtistHubPage';
import { ProfilePage } from './screens/ProfilePage';
import { ArtistPage } from './screens/ArtistPage';
import { CurationDetailPage } from './screens/CurationDetailPage';
import ArtworkDetailPage from './screens/ArtworkDetailPage';
import { CreateButton } from './components/CreateButton';
import {
  HomeIcon,
  GalleryIcon,
  UserIcon,
  PersonIcon,
} from './components/icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              paddingBottom: Math.max(insets.bottom, 8),
              height: 60 + Math.max(insets.bottom, 0),
            }
          ],
          tabBarActiveTintColor: theme.colors.text,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomePage}
          options={{
            title: '首页',
            tabBarIcon: ({ color, focused }) => (
              <HomeIcon size={24} color={color} filled={focused} />
            ),
            tabBarAccessibilityLabel: '首页标签',
          }}
        />
        <Tab.Screen
          name="CurationCenter"
          component={CurationCenterPage}
          options={{
            title: '策展',
            tabBarIcon: ({ color, focused }) => (
              <GalleryIcon size={24} color={color} filled={focused} />
            ),
            tabBarAccessibilityLabel: '策展标签',
          }}
        />
        <Tab.Screen
          name="ArtistHub"
          component={ArtistHubPage}
          options={{
            title: '艺术家',
            tabBarIcon: ({ color, focused }) => (
              <UserIcon size={24} color={color} filled={focused} />
            ),
            tabBarAccessibilityLabel: '艺术家标签',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfilePage}
          options={{
            title: '我',
            tabBarIcon: ({ color, focused }) => (
              <PersonIcon size={24} color={color} filled={focused} />
            ),
            tabBarAccessibilityLabel: '我标签',
          }}
        />
      </Tab.Navigator>
      <CreateButton />
    </View>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen 
        name="CurationDetail" 
        component={CurationDetailPage}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen 
        name="ArtworkDetailPage" 
        component={ArtworkDetailPage}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen 
        name="ArtistPage" 
        component={ArtistPage}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  useEffect(() => {
    // Enable accessibility features
    if (Platform.OS === 'ios') {
      AccessibilityInfo.setAccessibilityFocus;
    }
    
    // Announce app launch for screen readers
    const announceAppReady = async () => {
      const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      if (isScreenReaderEnabled) {
        setTimeout(() => {
          AccessibilityInfo.announceForAccessibility('星云艺术应用已启动');
        }, 1000);
      }
    };
    
    announceAppReady();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={theme.colors.surface} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 60,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    marginTop: 2,
  },
  tabBarIcon: {
    marginBottom: -2,
  },
});
