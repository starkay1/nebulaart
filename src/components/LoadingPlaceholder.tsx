import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';

interface LoadingPlaceholderProps {
  height: number;
  width?: number;
  borderRadius?: number;
}

export const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  height,
  width,
  borderRadius = theme.borderRadius.lg,
}) => {
  return (
    <View style={[styles.container, { height, ...(width && { width }) }]}>
      <LinearGradient
        colors={[theme.colors.gray200, theme.colors.gray100, theme.colors.gray200]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { borderRadius }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray100,
    overflow: 'hidden',
    width: '100%',
  },
  gradient: {
    flex: 1,
    opacity: 0.6,
  },
});
