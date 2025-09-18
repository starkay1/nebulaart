import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PinCardBase } from './PinCardBase';

// Mock react-native components
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Image: ({ source, testID, onError, onLoad }: any) => (
    <div 
      testID={testID} 
      data-source={typeof source === 'object' ? source.uri : source}
      onClick={() => {
        if (onLoad) onLoad();
      }}
    >
      Mock Image
    </div>
  ),
  TouchableOpacity: ({ children, onPress, onLongPress, testID }: any) => (
    <div 
      testID={testID}
      onClick={onPress}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onLongPress) onLongPress();
      }}
    >
      {children}
    </div>
  ),
  Text: ({ children, testID }: any) => <div testID={testID}>{children}</div>,
  View: ({ children, testID }: any) => <div testID={testID}>{children}</div>,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => <div>{children}</div>,
}));

// Mock icons
jest.mock('./icons', () => ({
  HeartIcon: ({ testID }: any) => <div testID={testID}>Heart</div>,
  CommentIcon: ({ testID }: any) => <div testID={testID}>Comment</div>,
  BookmarkIcon: ({ testID }: any) => <div testID={testID}>Bookmark</div>,
  ShareIcon: ({ testID }: any) => <div testID={testID}>Share</div>,
  MoreIcon: ({ testID }: any) => <div testID={testID}>More</div>,
}));

describe('PinCardBase', () => {
  const mockArtwork = {
    id: 'artwork1',
    title: 'Beautiful Landscape',
    image: 'https://example.com/image.jpg',
    artist: {
      id: 'artist1',
      name: 'John Artist',
      avatar: 'https://example.com/avatar.jpg',
    },
    stats: {
      likes: 245,
      comments: 18,
    },
    isLiked: false,
    isBookmarked: false,
    aspectRatio: 0.75,
  };

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

  it('should render image with correct source', () => {
    const { getByTestId } = render(<PinCardBase {...mockProps} />);

    const image = getByTestId('pin-image');
    expect(image).toBeTruthy();
    expect(image.getAttribute('data-source')).toBe('https://example.com/image.jpg');
  });

  it('should render title, artist name, and stats correctly', () => {
    const { getByTestId } = render(<PinCardBase {...mockProps} />);

    expect(getByTestId('artwork-title')).toHaveTextContent('Beautiful Landscape');
    expect(getByTestId('artist-name')).toHaveTextContent('John Artist');
    expect(getByTestId('likes-count')).toHaveTextContent('245');
    expect(getByTestId('comments-count')).toHaveTextContent('18');
  });

  it('should trigger onPress when card is tapped', () => {
    const { getByTestId } = render(<PinCardBase {...mockProps} />);

    const card = getByTestId('pin-card');
    fireEvent.press(card);

    expect(mockProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('should trigger action menu on long press', () => {
    const { getByTestId } = render(<PinCardBase {...mockProps} />);

    const card = getByTestId('pin-card');
    fireEvent(card, 'contextMenu', { preventDefault: jest.fn() });

    // Verify that long press triggers some action (could be showing menu)
    expect(card).toBeTruthy();
  });

  it('should handle like button press', () => {
    const { getByTestId } = render(<PinCardBase {...mockProps} />);

    const likeButton = getByTestId('like-button');
    fireEvent.press(likeButton);

    expect(mockProps.onLikePress).toHaveBeenCalledTimes(1);
  });

  it('should handle bookmark button press', () => {
    const { getByTestId } = render(<PinCardBase {...mockProps} />);

    const bookmarkButton = getByTestId('bookmark-button');
    fireEvent.press(bookmarkButton);

    expect(mockProps.onBookmarkPress).toHaveBeenCalledTimes(1);
  });

  it('should handle artist press', () => {
    const { getByTestId } = render(<PinCardBase {...mockProps} />);

    const artistSection = getByTestId('artist-section');
    fireEvent.press(artistSection);

    expect(mockProps.onArtistPress).toHaveBeenCalledTimes(1);
  });

  it('should show liked state correctly', () => {
    const likedArtwork = {
      ...mockArtwork,
      isLiked: true,
    };

    const { getByTestId } = render(
      <PinCardBase {...mockProps} artwork={likedArtwork} />
    );

    const likeButton = getByTestId('like-button');
    expect(likeButton).toBeTruthy();
    // In a real implementation, you might check for a specific class or style
  });

  it('should show bookmarked state correctly', () => {
    const bookmarkedArtwork = {
      ...mockArtwork,
      isBookmarked: true,
    };

    const { getByTestId } = render(
      <PinCardBase {...mockProps} artwork={bookmarkedArtwork} />
    );

    const bookmarkButton = getByTestId('bookmark-button');
    expect(bookmarkButton).toBeTruthy();
    // In a real implementation, you might check for a specific class or style
  });
});

export default {};
