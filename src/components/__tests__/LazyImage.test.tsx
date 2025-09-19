import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LazyImage } from '../LazyImage';

describe('LazyImage', () => {
  const mockProps = {
    source: { uri: 'https://example.com/image.jpg' },
    style: { width: 200, height: 200 },
    onLoad: jest.fn(),
    onError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading placeholder initially', () => {
    const { getByTestId } = render(<LazyImage {...mockProps} />);
    
    // Should show loading indicator
    expect(() => getByTestId('loading-placeholder')).not.toThrow();
  });

  it('calls onLoad when image loads successfully', async () => {
    const { getByTestId } = render(<LazyImage {...mockProps} />);
    
    const image = getByTestId('lazy-image');
    fireEvent(image, 'onLoad');

    await waitFor(() => {
      expect(mockProps.onLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onError when image fails to load', async () => {
    const { getByTestId } = render(<LazyImage {...mockProps} />);
    
    const image = getByTestId('lazy-image');
    fireEvent(image, 'onError');

    await waitFor(() => {
      expect(mockProps.onError).toHaveBeenCalledTimes(1);
    });
  });

  it('shows error placeholder when image fails to load', async () => {
    const { getByTestId } = render(<LazyImage {...mockProps} />);
    
    const image = getByTestId('lazy-image');
    fireEvent(image, 'onError');

    await waitFor(() => {
      expect(() => getByTestId('error-placeholder')).not.toThrow();
    });
  });

  it('renders custom placeholder when provided', () => {
    const CustomPlaceholder = () => <div testID="custom-placeholder">Loading...</div>;
    
    const { getByTestId } = render(
      <LazyImage {...mockProps} placeholder={<CustomPlaceholder />} />
    );
    
    expect(() => getByTestId('custom-placeholder')).not.toThrow();
  });

  it('applies correct styles to image', () => {
    const { getByTestId } = render(<LazyImage {...mockProps} />);
    
    const image = getByTestId('lazy-image');
    expect(image.props.style).toEqual(
      expect.arrayContaining([mockProps.style])
    );
  });
});
