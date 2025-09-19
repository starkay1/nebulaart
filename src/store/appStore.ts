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
            stats: {
              ...artist.stats,
              followers: isCurrentlyFollowing ? artist.stats.followers - 1 : artist.stats.followers + 1
            }
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

      // 安全的API调用函数
      const safeApiCall = async (url: string, fallbackData: any[] = []) => {
        try {
          const response = await fetch(url, { 
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          return Array.isArray(data) ? data : fallbackData;
        } catch (error: any) {
          console.warn(`API call failed for ${url}:`, error.message);
          return fallbackData;
        }
      };

      // 并行加载所有数据，每个都有独立的错误处理
      const [artworksResponse, artistsResponse, curationsResponse] = await Promise.all([
        safeApiCall('https://nebulaart-api.onrender.com/api/artworks', []),
        safeApiCall('https://nebulaart-api.onrender.com/api/artists', []),
        safeApiCall('https://nebulaart-api.onrender.com/api/curations', [])
      ]);

      clearTimeout(timeoutId);

      // 生成stories数据，确保有足够的艺术家数据
      const stories: Story[] = artistsResponse.length > 0 
        ? artistsResponse.slice(0, 3).map((artist: Artist, index: number) => ({
            id: `story${index + 1}`,
            user: { id: artist.id, name: artist.name, avatar: artist.avatar },
            hasUpdate: index === 0,
            gradient: index === 0 ? ['#667eea', '#764ba2'] : ['#f093fb', '#f5576c'],
          }))
        : []; // 如果没有艺术家数据，返回空数组

      set({
        stories,
        artworks: artworksResponse,
        artists: artistsResponse,
        curations: curationsResponse,
        allUsers: artistsResponse,
        isLoading: false,
      });

      // 记录加载成功的数据量
      console.log(`Data loaded successfully: ${artworksResponse.length} artworks, ${artistsResponse.length} artists, ${curationsResponse.length} curations`);

    } catch (error: any) {
      console.error('Failed to load initial data:', error);
      
      // 提供用户友好的错误信息
      let errorMessage = '数据加载失败';
      
      if (error.name === 'AbortError') {
        errorMessage = '数据加载超时，请检查网络连接';
      } else if (!navigator.onLine) {
        errorMessage = '网络连接已断开，请检查网络设置';
      }
      
      console.error('User-friendly error:', errorMessage);
      
      // 设置默认的空数据状态，确保应用仍可使用
      set({
        stories: [],
        artworks: [],
        artists: [],
        curations: [],
        allUsers: [],
        isLoading: false,
      });
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch(
        `https://nebulaart-api.onrender.com/api/artworks?offset=${state.artworks.length}&limit=20`,
        { 
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newArtworks = await response.json();
      
      if (!Array.isArray(newArtworks)) {
        throw new Error('Invalid response format: expected array');
      }
      
      set({ 
        artworks: [...state.artworks, ...newArtworks],
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error loading artworks:', error);
      
      // 根据错误类型提供不同的用户反馈
      let errorMessage = '加载失败，请稍后重试';
      
      if (error.name === 'AbortError') {
        errorMessage = '请求超时，请检查网络连接';
      } else if (error.message?.includes('HTTP error')) {
        errorMessage = '服务器响应异常，请稍后重试';
      } else if (!navigator.onLine) {
        errorMessage = '网络连接已断开，请检查网络设置';
      }
      
      // 这里可以添加全局错误通知机制
      // 暂时使用console.error，后续可以改为toast通知
      console.error('User-friendly error:', errorMessage);
      
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
