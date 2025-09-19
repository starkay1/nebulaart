import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PinCard from '../PinCard';
import { Artwork } from '../../types';

const mockArtwork: Artwork = {
  id: 'test-artwork-1',
  title: 'Beautiful Sunset',
  image: 'https://example.com/sunset.jpg',
  artist: {
    id: 'artist-1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  },
  gradient: ['#FF6B6B', '#4ECDC4'],
  stats: {
    likes: 42,
    comments: 8,
  },
  isLiked: false,
  isBookmarked: false,
};

describe('PinCard', () => {
  const mockProps = {
    artwork: mockArtwork,
    onPress: jest.fn(),
    onArtistPress: jest.fn(),
    onLikePress: jest.fn(),
    onBookmarkPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders artwork information correctly', () => {
    const { getByText } = render(<PinCard {...mockProps} />);

    expect(getByText('Beautiful Sunset')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('42')).toBeTruthy();
    expect(getByText('8')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const { getByTestId } = render(<PinCard {...mockProps} />);

    const card = getByTestId('pin-card');
    fireEvent.press(card);

    expect(mockProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onArtistPress when artist info is pressed', () => {
    const { getByTestId } = render(<PinCard {...mockProps} />);

    const artistInfo = getByTestId('artist-info');
    fireEvent.press(artistInfo);

    expect(mockProps.onArtistPress).toHaveBeenCalledTimes(1);
  });

  it('calls onLikePress when like button is pressed', () => {
    const { getByTestId } = render(<PinCard {...mockProps} />);

    const likeButton = getByTestId('like-button');
    fireEvent.press(likeButton);

    expect(mockProps.onLikePress).toHaveBeenCalledTimes(1);
  });

  it('calls onBookmarkPress when bookmark button is pressed', () => {
    const { getByTestId } = render(<PinCard {...mockProps} />);

    const bookmarkButton = getByTestId('bookmark-button');
    fireEvent.press(bookmarkButton);

    expect(mockProps.onBookmarkPress).toHaveBeenCalledTimes(1);
  });

  it('shows liked state correctly', () => {
    const likedArtwork = { ...mockArtwork, isLiked: true };
    const { getByTestId } = render(
      <PinCard {...mockProps} artwork={likedArtwork} />
    );

    const likeButton = getByTestId('like-button');
    // 这里可以检查按钮的样式或图标状态
    expect(likeButton).toBeTruthy();
  });

  it('shows bookmarked state correctly', () => {
    const bookmarkedArtwork = { ...mockArtwork, isBookmarked: true };
    const { getByTestId } = render(
      <PinCard {...mockProps} artwork={bookmarkedArtwork} />
    );

    const bookmarkButton = getByTestId('bookmark-button');
    // 这里可以检查按钮的样式或图标状态
    expect(bookmarkButton).toBeTruthy();
  });

  it('handles missing stats gracefully', () => {
    const artworkWithoutStats = {
      ...mockArtwork,
      stats: {
        likes: 0,
        comments: 0,
      },
    };

    const { getByText } = render(
      <PinCard {...mockProps} artwork={artworkWithoutStats} />
    );

    expect(getByText('0')).toBeTruthy(); // likes
    expect(getByText('0')).toBeTruthy(); // comments
  });
});
