import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '../ErrorBoundary';
import { Text } from 'react-native';

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text testID="success">Success</Text>;
};

// Mock console.error to avoid noise in test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(getByTestId('success')).toBeTruthy();
  });

  it('renders error UI when child component throws', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('出现了一些问题')).toBeTruthy();
    expect(getByText('应用遇到了意外错误，请尝试重新加载页面。')).toBeTruthy();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = () => <Text testID="custom-error">Custom Error</Text>;

    const { getByTestId } = render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByTestId('custom-error')).toBeTruthy();
  });

  it('shows retry button and handles retry', () => {
    const { getByText, queryByTestId } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(getByText('出现了一些问题')).toBeTruthy();

    // Click retry button
    const retryButton = getByText('重试');
    fireEvent.press(retryButton);

    // Should attempt to render children again
    // Note: In a real scenario, the component might not throw on retry
  });

  it('shows refresh page button', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('刷新页面')).toBeTruthy();
  });

  it('logs error details in development mode', () => {
    const originalDev = (global as any).__DEV__;
    (global as any).__DEV__ = true;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();

    (global as any).__DEV__ = originalDev;
  });

  it('shows error details in development mode', () => {
    const originalDev = (global as any).__DEV__;
    (global as any).__DEV__ = true;

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText(/错误详情:/)).toBeTruthy();

    (global as any).__DEV__ = originalDev;
  });

  it('does not show error details in production mode', () => {
    const originalDev = (global as any).__DEV__;
    (global as any).__DEV__ = false;

    const { queryByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(queryByText(/错误详情:/)).toBeNull();

    (global as any).__DEV__ = originalDev;
  });
});
