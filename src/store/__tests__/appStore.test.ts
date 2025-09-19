import { renderHook, act } from '@testing-library/react-hooks';
import { useAppStore } from '../appStore';

// Mock fetch
global.fetch = jest.fn();

describe('AppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      currentUser: null,
      currentTab: 'Home',
      stories: [],
      artworks: [],
      artists: [],
      curations: [],
      boards: [],
      comments: {},
      notifications: [],
      followingList: [],
      savedArtworks: [],
      allUsers: [],
      isCreateMenuOpen: false,
      selectedFilter: '全部',
      isDarkMode: false,
      isLoading: false,
    });

    (fetch as jest.Mock).mockClear();
  });

  describe('Navigation', () => {
    it('should set current tab', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setCurrentTab('Profile');
      });

      expect(result.current.currentTab).toBe('Profile');
    });

    it('should toggle create menu', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.isCreateMenuOpen).toBe(false);

      act(() => {
        result.current.toggleCreateMenu();
      });

      expect(result.current.isCreateMenuOpen).toBe(true);

      act(() => {
        result.current.toggleCreateMenu();
      });

      expect(result.current.isCreateMenuOpen).toBe(false);
    });
  });

  describe('Artwork Interactions', () => {
    const mockArtwork = {
      id: 'artwork-1',
      title: 'Test Artwork',
      image: 'https://example.com/image.jpg',
      artist: {
        id: 'artist-1',
        name: 'Test Artist',
        avatar: 'https://example.com/avatar.jpg',
      },
      gradient: ['#FF6B6B', '#4ECDC4'],
      stats: {
        likes: 10,
        comments: 5,
      },
      isLiked: false,
      isBookmarked: false,
    };

    beforeEach(() => {
      useAppStore.setState({
        artworks: [mockArtwork],
      });
    });

    it('should toggle like on artwork', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.toggleLike('artwork-1');
      });

      const updatedArtwork = result.current.artworks.find(a => a.id === 'artwork-1');
      expect(updatedArtwork?.isLiked).toBe(true);
      expect(updatedArtwork?.stats.likes).toBe(11);
    });

    it('should toggle bookmark on artwork', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.toggleBookmark('artwork-1');
      });

      const updatedArtwork = result.current.artworks.find(a => a.id === 'artwork-1');
      expect(updatedArtwork?.isBookmarked).toBe(true);
      expect(result.current.savedArtworks).toContain('artwork-1');
    });
  });

  describe('Board Management', () => {
    it('should create a new board', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.createBoard('Test Board');
      });

      expect(result.current.boards).toHaveLength(1);
      expect(result.current.boards[0].name).toBe('Test Board');
      expect(result.current.boards[0].artworkIds).toEqual([]);
    });

    it('should add artwork to board', () => {
      const { result } = renderHook(() => useAppStore());

      // Create a board first
      act(() => {
        result.current.createBoard('Test Board');
      });

      const boardId = result.current.boards[0].id;

      act(() => {
        result.current.addArtworkToBoard(boardId, 'artwork-1');
      });

      const updatedBoard = result.current.boards.find(b => b.id === boardId);
      expect(updatedBoard?.artworkIds).toContain('artwork-1');
    });

    it('should remove artwork from board', () => {
      const { result } = renderHook(() => useAppStore());

      // Create a board and add artwork
      act(() => {
        result.current.createBoard('Test Board');
      });

      const boardId = result.current.boards[0].id;

      act(() => {
        result.current.addArtworkToBoard(boardId, 'artwork-1');
        result.current.removeArtworkFromBoard(boardId, 'artwork-1');
      });

      const updatedBoard = result.current.boards.find(b => b.id === boardId);
      expect(updatedBoard?.artworkIds).not.toContain('artwork-1');
    });
  });

  describe('Notifications', () => {
    it('should add notification', () => {
      const { result } = renderHook(() => useAppStore());

      const notificationData = {
        type: 'like',
        message: 'Someone liked your artwork',
        relatedId: 'artwork-1',
      };

      act(() => {
        result.current.addNotification(notificationData);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].type).toBe('like');
      expect(result.current.notifications[0].isRead).toBe(false);
    });

    it('should mark notification as read', () => {
      const { result } = renderHook(() => useAppStore());

      // Add notification first
      act(() => {
        result.current.addNotification({
          type: 'like',
          message: 'Test notification',
          relatedId: 'artwork-1',
        });
      });

      const notificationId = result.current.notifications[0].id;

      act(() => {
        result.current.markNotificationAsRead(notificationId);
      });

      const updatedNotification = result.current.notifications.find(n => n.id === notificationId);
      expect(updatedNotification?.isRead).toBe(true);
    });

    it('should clear all notifications', () => {
      const { result } = renderHook(() => useAppStore());

      // Add some notifications first
      act(() => {
        result.current.addNotification({ type: 'like', message: 'Test 1', relatedId: 'artwork-1' });
        result.current.addNotification({ type: 'follow', message: 'Test 2', relatedId: 'user-1' });
      });

      expect(result.current.notifications).toHaveLength(2);

      act(() => {
        result.current.clearAllNotifications();
      });

      expect(result.current.notifications).toHaveLength(0);
    });
  });

  describe('Artist Following', () => {
    const mockArtist = {
      id: 'artist-1',
      name: 'Test Artist',
      avatar: 'https://example.com/avatar.jpg',
      bio: 'Test bio',
      stats: {
        followers: 100,
        artworks: 20,
        likes: 500,
      },
      isFollowing: false,
    };

    beforeEach(() => {
      useAppStore.setState({
        artists: [mockArtist],
        followingList: [],
      });
    });

    it('should follow an artist', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.toggleFollow('artist-1');
      });

      expect(result.current.followingList).toContain('artist-1');
      
      const updatedArtist = result.current.artists.find(a => a.id === 'artist-1');
      expect(updatedArtist?.isFollowing).toBe(true);
      expect(updatedArtist?.stats.followers).toBe(101);
    });

    it('should unfollow an artist', () => {
      const { result } = renderHook(() => useAppStore());

      // Follow first
      act(() => {
        result.current.toggleFollow('artist-1');
      });

      // Then unfollow
      act(() => {
        result.current.toggleFollow('artist-1');
      });

      expect(result.current.followingList).not.toContain('artist-1');
      
      const updatedArtist = result.current.artists.find(a => a.id === 'artist-1');
      expect(updatedArtist?.isFollowing).toBe(false);
      expect(updatedArtist?.stats.followers).toBe(100);
    });
  });
});
