import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 在开发环境中显示更多信息
    if (__DEV__) {
      console.error('Error details:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义的 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>出现了一些问题</Text>
          <Text style={styles.message}>
            应用遇到了意外错误，请尝试重新加载页面。
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorDetails}>
              错误详情: {this.state.error.message}
            </Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleRetry}
          >
            <Text style={styles.buttonText}>重试</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>刷新页面</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorDetails: {
    fontSize: 12,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
});
