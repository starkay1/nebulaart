import React, { useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';

interface LazyImageProps {
  source: { uri: string };
  style?: any;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  source,
  style,
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const defaultPlaceholder = (
    <View style={[styles.placeholder, style]}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
    </View>
  );

  const errorPlaceholder = (
    <View style={[styles.placeholder, styles.errorPlaceholder, style]}>
      <View style={styles.errorIcon}>
        <View style={styles.errorIconInner} />
      </View>
    </View>
  );

  if (hasError) {
    return errorPlaceholder;
  }

  return (
    <View style={style}>
      {isLoading && (placeholder || defaultPlaceholder)}
      <Image
        source={source}
        style={[style, isLoading && styles.hidden]}
        onLoad={handleLoad}
        onError={handleError}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  errorPlaceholder: {
    backgroundColor: '#f5f5f5',
  },
  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#999',
  },
  hidden: {
    opacity: 0,
  },
});
