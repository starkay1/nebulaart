import { renderHook, act } from '@testing-library/react-hooks';
import { useAppStore } from './appStore';

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

// Mock apiClient
jest.mock('../config/api', () => ({
  apiClient: {
    login: jest.fn(),
    register: jest.fn(),
    setToken: jest.fn(),
  },
}));

describe('AppStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
    mockAsyncStorage.removeItem.mockResolvedValue(undefined);
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.currentUser).toBeNull();
    expect(result.current.currentTab).toBe('Home');
    expect(result.current.artworks).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isDarkMode).toBe(false);
  });

  it('should handle user login successfully', async () => {
    const { apiClient } = require('../config/api');
    const mockUser = {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      token: 'mock-token',
    };

    apiClient.login.mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    });

    const { result } = renderHook(() => useAppStore());

    await act(async () => {
      const success = await result.current.login('test@example.com', 'password');
      expect(success).toBe(true);
    });

    expect(result.current.currentUser).toEqual({
      ...mockUser,
      token: 'mock-token',
    });
    expect(apiClient.setToken).toHaveBeenCalledWith('mock-token');
  });

  it('should handle user registration', async () => {
    const { apiClient } = require('../config/api');
    const mockUserData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
    };

    apiClient.register.mockResolvedValue({
      user: mockUserData,
      token: 'new-token',
    });

    const { result } = renderHook(() => useAppStore());

    await act(async () => {
      const success = await result.current.register(mockUserData);
      expect(success).toBe(true);
    });

    expect(result.current.currentUser).toEqual({
      ...mockUserData,
      token: 'new-token',
    });
    expect(apiClient.setToken).toHaveBeenCalledWith('new-token');
  });

  it('should toggle follow status for artist', () => {
    const { result } = renderHook(() => useAppStore());
    
    // Set initial state with artists
    act(() => {
      result.current.artists = [
        {
          id: 'artist1',
          name: 'Test Artist',
          followers: 100,
          isFollowing: false,
        },
      ];
    });

    act(() => {
      result.current.toggleFollow('artist1');
    });

    expect(result.current.followingList).toContain('artist1');
    expect(result.current.artists[0].isFollowing).toBe(true);
    expect(result.current.artists[0].followers).toBe(101);
  });

  it('should toggle bookmark status for artwork', () => {
    const { result } = renderHook(() => useAppStore());
    
    // Set initial state with artworks
    act(() => {
      result.current.artworks = [
        {
          id: 'artwork1',
          title: 'Test Artwork',
          isBookmarked: false,
        },
      ];
    });

    act(() => {
      result.current.toggleBookmark('artwork1');
    });

    expect(result.current.savedArtworks).toContain('artwork1');
    expect(result.current.artworks[0].isBookmarked).toBe(true);
  });

  it('should persist user state to storage', async () => {
    const { result } = renderHook(() => useAppStore());
    
    // Set some state
    act(() => {
      result.current.currentUser = {
        id: 'user1',
        name: 'Test User',
      };
      result.current.followingList = ['artist1'];
      result.current.savedArtworks = ['artwork1'];
    });

    await act(async () => {
      await result.current.saveToStorage();
    });

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'appState',
      expect.stringContaining('"currentUser"')
    );
  });

  it('should load initial data from API', async () => {
    const mockArtworks = [{ id: 'artwork1', title: 'Test Artwork' }];
    const mockArtists = [{ id: 'artist1', name: 'Test Artist' }];
    const mockCurations = [{ id: 'curation1', title: 'Test Curation' }];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockArtworks),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockArtists),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockCurations),
      });

    const { result } = renderHook(() => useAppStore());

    await act(async () => {
      await result.current.loadInitialData();
    });

    expect(result.current.artworks).toEqual(mockArtworks);
    expect(result.current.artists).toEqual(mockArtists);
    expect(result.current.curations).toEqual(mockCurations);
    expect(result.current.isLoading).toBe(false);
  });
});

export default {};
