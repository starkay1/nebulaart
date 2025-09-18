import { create } from 'zustand';
import type { User, Artist, Artwork, Story, Curation, Board, Comment, Notification, UserArtwork } from '../types/index';
import { apiClient } from '../config/api';

// AsyncStorage for web
const AsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

export type { Comment, User, Artist, Artwork, Story, Curation, Board, Notification, UserArtwork } from '../types/index';

interface AppState {
  // Current user
  currentUser: User | null;
  
  // Navigation
  currentTab: string;
  
  // Data
  stories: Story[];
  artworks: Artwork[];
  artists: Artist[];
  curations: Curation[];
  boards: Board[];
  comments: { [artworkId: string]: Comment[] };
  notifications: Notification[];
  followingList: string[];
  savedArtworks: string[];
  allUsers: User[];
  
  // UI State
  isCreateMenuOpen: boolean;
  selectedFilter: string;
  isDarkMode: boolean;
  isLoading: boolean;

  // Actions
  setCurrentTab: (tab: string) => void;
  toggleCreateMenu: () => void;
  setSelectedFilter: (filter: string) => void;
  toggleLike: (artworkId: string) => void;
  toggleBookmark: (artworkId: string) => void;
  toggleFollow: (artistId: string) => void;
  isUserFollowing: (artistId: string) => boolean;
  toggleDarkMode: () => void;
  
  // Data loading
  loadInitialData: () => Promise<void>;
  
  // Authentication
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  
  // Board management
  createBoard: (name: string) => void;
  addArtworkToBoard: (boardId: string, artworkId: string) => void;
  removeArtworkFromBoard: (boardId: string, artworkId: string) => void;
  
  // Curation management
  createCuration: (curationData: any) => void;
  
  // Comments
  addComment: (artworkId: string, text: string) => void;
  toggleCommentLike: (artworkId: string, commentId: string) => void;
  
  // Notifications
  addNotification: (notificationData: any) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // Data management
  loadMoreArtworks: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
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

  // Navigation actions
  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  toggleCreateMenu: () => set((state) => ({ 
    isCreateMenuOpen: !state.isCreateMenuOpen 
  })),
  
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),

  // Interaction actions
  toggleLike: (artworkId) => {
    const state = get();
    const updatedArtworks = state.artworks.map(artwork => 
      artwork.id === artworkId 
        ? { 
            ...artwork, 
            isLiked: !artwork.isLiked,
            stats: {
              ...artwork.stats,
              likes: artwork.isLiked ? artwork.stats.likes - 1 : artwork.stats.likes + 1
            }
          }
        : artwork
    );
    set({ artworks: updatedArtworks });
  },

  toggleBookmark: (artworkId) => {
    const state = get();
    const updatedArtworks = state.artworks.map(artwork => 
      artwork.id === artworkId 
        ? { ...artwork, isBookmarked: !artwork.isBookmarked }
        : artwork
    );
    const updatedSavedArtworks = state.savedArtworks.includes(artworkId)
      ? state.savedArtworks.filter(id => id !== artworkId)
      : [...state.savedArtworks, artworkId];
    
    set({ 
      artworks: updatedArtworks,
      savedArtworks: updatedSavedArtworks
    });
  },

  toggleFollow: (artistId) => {
    const state = get();
    const isCurrentlyFollowing = state.followingList.includes(artistId);
    const updatedFollowingList = isCurrentlyFollowing
      ? state.followingList.filter(id => id !== artistId)
      : [...state.followingList, artistId];
    
    const updatedArtists = state.artists.map(artist => 
      artist.id === artistId 
        ? { 
            ...artist, 
            isFollowing: !isCurrentlyFollowing,
            followers: isCurrentlyFollowing ? artist.followers - 1 : artist.followers + 1
          }
        : artist
    );
    
    set({ 
      followingList: updatedFollowingList,
      artists: updatedArtists
    });
  },

  isUserFollowing: (artistId) => {
    const state = get();
    return state.currentUser?.followingList?.includes(artistId) || false;
  },

  toggleDarkMode: () => set((state) => ({ 
    isDarkMode: !state.isDarkMode 
  })),

  // Data loading
  loadInitialData: async () => {
    try {
      set({ isLoading: true });

      // 并行加载所有数据
      const [artworksResponse, artistsResponse, curationsResponse] = await Promise.all([
        fetch('https://nebulaart-api.onrender.com/api/artworks').then(r => r.json()).catch(() => []),
        fetch('https://nebulaart-api.onrender.com/api/artists').then(r => r.json()).catch(() => []),
        fetch('https://nebulaart-api.onrender.com/api/curations').then(r => r.json()).catch(() => [])
      ]);

      // 生成stories数据
      const stories: Story[] = artistsResponse.slice(0, 3).map((artist: Artist, index: number) => ({
        id: `story${index + 1}`,
        user: { id: artist.id, name: artist.name, avatar: artist.avatar },
        hasUpdate: index === 0,
        gradient: index === 0 ? ['#667eea', '#764ba2'] : ['#f093fb', '#f5576c'],
      }));

      set({
        stories,
        artworks: artworksResponse,
        artists: artistsResponse,
        curations: curationsResponse,
        allUsers: artistsResponse,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load initial data:', error);
      set({ isLoading: false });
    }
  },

  // Authentication actions
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // 尝试真实 API
      const response = await apiClient.login(email, password);
      
      if (response && response.user && response.token) {
        // 设置 API 客户端的 token
        apiClient.setToken(response.token);
        
        const user: User = {
          ...response.user,
          token: response.token,
        };
        
        set({ 
          currentUser: user, 
          isLoading: false 
        });
        
        // Save to storage
        get().saveToStorage();
        
        return true;
      }
    } catch (error) {
      console.log('API login failed, falling back to mock data:', error);
      
      // 如果 API 失败，回退到模拟数据
      if (email === 'test@example.com' && password === 'password') {
        const user: User = {
          id: 'user1',
          name: '测试用户',
          username: 'testuser',
          email: email,
          isArtist: false,
          followers: 1200,
          following: 45,
          artworks: 8,
          stats: {
            followers: 1200,
            artworks: 8,
            likes: 8900,
          },
          token: 'mock_jwt_token_' + Date.now(),
        };
        
        set({ 
          currentUser: user, 
          isLoading: false 
        });
        
        // Save to storage
        get().saveToStorage();
        
        return true;
      }
    }
    
    set({ isLoading: false });
    return false;
  },

  register: async (userData: any) => {
    set({ isLoading: true });
    
    try {
      const response = await apiClient.register(userData);
      
      if (response && response.user && response.token) {
        apiClient.setToken(response.token);
        
        const user: User = {
          ...response.user,
          token: response.token,
        };
        
        set({ 
          currentUser: user, 
          isLoading: false 
        });
        
        get().saveToStorage();
        return true;
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
    
    set({ isLoading: false });
    return false;
  },

  logout: () => {
    set({ currentUser: null });
    get().saveToStorage();
  },

  // Board management
  createBoard: (name: string) => {
    const state = get();
    const newBoard: Board = {
      id: `board_${Date.now()}`,
      name,
      userId: state.currentUser?.id || 'user1',
      artworkIds: [],
      coverImage: null,
      createdAt: new Date().toISOString(),
    };
    
    set({ boards: [...state.boards, newBoard] });
  },

  addArtworkToBoard: (boardId: string, artworkId: string) => {
    const state = get();
    const updatedBoards = state.boards.map(board => 
      board.id === boardId && !board.artworkIds.includes(artworkId)
        ? { ...board, artworkIds: [...board.artworkIds, artworkId] }
        : board
    );
    set({ boards: updatedBoards });
  },

  removeArtworkFromBoard: (boardId: string, artworkId: string) => {
    const state = get();
    const updatedBoards = state.boards.map(board => 
      board.id === boardId
        ? { ...board, artworkIds: board.artworkIds.filter((id: string) => id !== artworkId) }
        : board
    );
    set({ boards: updatedBoards });
  },

  // Curation management
  createCuration: (curationData: any) => {
    const state = get();
    const newCuration: Curation = {
      id: `curation_${Date.now()}`,
      ...curationData,
      stats: { likes: 0, views: 0, shares: 0 },
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    
    set({ curations: [...state.curations, newCuration] });
  },

  // Comments
  addComment: (artworkId: string, text: string) => {
    const state = get();
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      userId: state.currentUser?.id || 'anonymous',
      userName: state.currentUser?.name || 'Anonymous',
      userAvatar: state.currentUser?.avatar || 'https://via.placeholder.com/40',
      text,
      timestamp: new Date().toLocaleString(),
      likes: 0,
      isLiked: false,
    };
    
    const updatedComments = {
      ...state.comments,
      [artworkId]: [...(state.comments[artworkId] || []), newComment]
    };
    
    // Update artwork comment count
    const updatedArtworks = state.artworks.map(artwork => 
      artwork.id === artworkId
        ? { ...artwork, stats: { ...artwork.stats, comments: artwork.stats.comments + 1 } }
        : artwork
    );
    
    set({ 
      comments: updatedComments,
      artworks: updatedArtworks
    });
  },

  toggleCommentLike: (artworkId: string, commentId: string) => {
    const state = get();
    const updatedComments = {
      ...state.comments,
      [artworkId]: state.comments[artworkId]?.map(comment => 
        comment.id === commentId
          ? { 
              ...comment, 
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      ) || []
    };
    
    set({ comments: updatedComments });
  },

  // Notifications
  addNotification: (notificationData: any) => {
    const state = get();
    const newNotification: Notification = {
      id: `notification_${Date.now()}`,
      ...notificationData,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    set({ notifications: [newNotification, ...state.notifications] });
  },

  markNotificationAsRead: (notificationId: string) => {
    const state = get();
    const updatedNotifications = state.notifications.map(notification => 
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    
    set({ notifications: updatedNotifications });
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },

  // Data management
  loadMoreArtworks: async () => {
    const state = get();
    set({ isLoading: true });
    
    try {
      const response = await fetch(`https://nebulaart-api.onrender.com/api/artworks?offset=${state.artworks.length}&limit=20`);
      const newArtworks = await response.json();
      
      set({ 
        artworks: [...state.artworks, ...newArtworks],
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load more artworks:', error);
      set({ isLoading: false });
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      const dataToSave = {
        currentUser: state.currentUser,
        followingList: state.followingList,
        savedArtworks: state.savedArtworks,
        boards: state.boards,
      };
      await AsyncStorage.setItem('appState', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  },

  loadFromStorage: async () => {
    try {
      const savedData = await AsyncStorage.getItem('appState');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        set({
          currentUser: parsedData.currentUser,
          followingList: parsedData.followingList || [],
          savedArtworks: parsedData.savedArtworks || [],
          boards: parsedData.boards || [],
        });
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  },
}));

// Initialize the store
useAppStore.getState().loadFromStorage().then(() => {
  useAppStore.getState().loadInitialData();
});
