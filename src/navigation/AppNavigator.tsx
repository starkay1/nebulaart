import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import { HomePage } from '../screens/HomePage';
import { CurationCenterPage } from '../screens/CurationCenterPage';
import { ArtistHubPage } from '../screens/ArtistHubPage';
import { ProfilePage } from '../screens/ProfilePage';
import { ArtistPage } from '../screens/ArtistPage';
import { CurationDetailPage } from '../screens/CurationDetailPage';
import ArtworkDetailPage from '../screens/ArtworkDetailPage';

// Import icons
import HomeIcon from '../components/icons/HomeIcon';
import CurationIcon from '../components/icons/CurationIcon';
import ProfileIcon from '../components/icons/ProfileIcon';
import BoardIcon from '../components/icons/BoardIcon';

// Import theme
import { theme } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CurationCenter"
        component={CurationCenterPage}
        options={{
          tabBarLabel: '策展中心',
          tabBarIcon: ({ color, size }) => (
            <CurationIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ArtistHub"
        component={ArtistHubPage}
        options={{
          tabBarLabel: '艺术家中心',
          tabBarIcon: ({ color, size }) => (
            <BoardIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ArtworkDetailPage"
          component={ArtworkDetailPage}
          options={{
            presentation: 'modal',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="ArtistPage"
          component={ArtistPage}
          options={{
            presentation: 'modal',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="CurationDetailPage"
          component={CurationDetailPage}
          options={{
            presentation: 'modal',
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
