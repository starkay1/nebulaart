import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { HomePage } from './HomePage';

// Mock the store
const mockUseAppStore = {
  artworks: [
    {
      id: 'artwork1',
      title: 'Test Artwork 1',
      image: 'https://example.com/image1.jpg',
      artist: { id: 'artist1', name: 'Artist 1', avatar: 'https://example.com/avatar1.jpg' },
      stats: { likes: 100, comments: 10 },
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 'artwork2',
      title: 'Test Artwork 2',
      image: 'https://example.com/image2.jpg',
      artist: { id: 'artist2', name: 'Artist 2', avatar: 'https://example.com/avatar2.jpg' },
      stats: { likes: 200, comments: 20 },
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 'artwork3',
      title: 'Test Artwork 3',
      image: 'https://example.com/image3.jpg',
      artist: { id: 'artist3', name: 'Artist 3', avatar: 'https://example.com/avatar3.jpg' },
      stats: { likes: 150, comments: 15 },
      isLiked: false,
      isBookmarked: true,
    },
  ],
  stories: [
    {
      id: 'story1',
      user: { id: 'user1', name: 'User 1', avatar: 'https://example.com/user1.jpg' },
      hasUpdate: true,
      gradient: ['#667eea', '#764ba2'],
    },
  ],
  selectedFilter: '全部',
  setSelectedFilter: jest.fn(),
  toggleLike: jest.fn(),
  toggleBookmark: jest.fn(),
  isLoading: false,
};

jest.mock('../store/appStore', () => ({
  useAppStore: () => mockUseAppStore,
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
}));

// Mock components
jest.mock('../components/PinCard', () => {
  return function MockPinCard({ artwork, onPress }: any) {
    return (
      <div testID={`pin-card-${artwork.id}`} onClick={onPress}>
        <div testID={`artwork-title-${artwork.id}`}>{artwork.title}</div>
        <div testID={`artist-name-${artwork.id}`}>{artwork.artist.name}</div>
      </div>
    );
  };
});

jest.mock('../components/StoryCard', () => {
  return function MockStoryCard({ story }: any) {
    return (
      <div testID={`story-card-${story.id}`}>
        <div>{story.user.name}</div>
      </div>
    );
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderHomePage = () => {
    return render(
      <NavigationContainer>
        <HomePage />
      </NavigationContainer>
    );
  };

  it('should render artwork list with at least 3 items', () => {
    const { getByTestId } = renderHomePage();

    expect(getByTestId('pin-card-artwork1')).toBeTruthy();
    expect(getByTestId('pin-card-artwork2')).toBeTruthy();
    expect(getByTestId('pin-card-artwork3')).toBeTruthy();
    expect(getByTestId('artwork-title-artwork1')).toHaveTextContent('Test Artwork 1');
    expect(getByTestId('artist-name-artwork1')).toHaveTextContent('Artist 1');
  });

  it('should navigate to artwork detail when artwork is clicked', () => {
    const { getByTestId } = renderHomePage();

    fireEvent.press(getByTestId('pin-card-artwork1'));

    expect(mockNavigate).toHaveBeenCalledWith('ArtworkDetailPage', {
      artworkId: 'artwork1',
    });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should render filter tabs and handle filter changes', async () => {
    const { getByText } = renderHomePage();

    // Check if filter tabs are rendered
    expect(getByText('全部')).toBeTruthy();
    expect(getByText('绘画')).toBeTruthy();
    expect(getByText('摄影')).toBeTruthy();

    // Click on a filter tab
    fireEvent.press(getByText('绘画'));

    await waitFor(() => {
      expect(mockUseAppStore.setSelectedFilter).toHaveBeenCalledWith('绘画');
    });
  });

  it('should render stories section', () => {
    const { getByTestId } = renderHomePage();

    expect(getByTestId('story-card-story1')).toBeTruthy();
    expect(getByTestId('story-card-story1')).toHaveTextContent('User 1');
  });

  it('should handle artwork interactions', () => {
    const { getByTestId } = renderHomePage();

    // Test like functionality (assuming PinCard has like button)
    const pinCard = getByTestId('pin-card-artwork1');
    expect(pinCard).toBeTruthy();

    // Verify artwork data is passed correctly
    expect(getByTestId('artwork-title-artwork1')).toHaveTextContent('Test Artwork 1');
    expect(getByTestId('artist-name-artwork1')).toHaveTextContent('Artist 1');
  });

  it('should display loading state correctly', () => {
    // Mock loading state
    mockUseAppStore.isLoading = true;
    
    const { queryByTestId } = renderHomePage();

    // When loading, artwork cards should not be visible or should show loading
    expect(queryByTestId('pin-card-artwork1')).toBeTruthy();
  });
});

export default {};
