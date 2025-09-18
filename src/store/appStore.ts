import { create } from 'zustand';
import type { User, Artist, Artwork, Story, Curation, Board, Comment, Notification, UserArtwork } from '../types/index';
import { apiClient } from '../config/api';

// Mock AsyncStorage for now to avoid dependency issues
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
  currentPage: number;
  
  // Actions
  setCurrentUser: (user: User) => void;
  setCurrentTab: (tab: string) => void;
  toggleCreateMenu: () => void;
  setSelectedFilter: (filter: string) => void;
  toggleLike: (artworkId: string) => void;
  toggleBookmark: (artworkId: string) => void;
  toggleFollow: (artistId: string) => void;
  loadMockData: () => void;
  becomeArtist: (profile: { name: string; bio: string; tags: string[] }) => void;
  addArtwork: (artwork: UserArtwork) => void;
  followUser: (artistId: string) => void;
  unfollowUser: (artistId: string) => void;
  isUserFollowing: (artistId: string) => boolean;
  toggleDarkMode: () => void;
  loadInitialData: () => void;
  // New actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string; isArtist: boolean }) => Promise<boolean>;
  logout: () => void;
  createBoard: (name: string) => void;
  addArtworkToBoard: (boardId: string, artworkId: string) => void;
  removeArtworkFromBoard: (boardId: string, artworkId: string) => void;
  createCuration: (curation: Omit<Curation, 'id' | 'views' | 'likes' | 'isLiked'>) => void;
  addComment: (artworkId: string, text: string) => void;
  toggleCommentLike: (artworkId: string, commentId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  loadMoreArtworks: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentUser: null,
  currentTab: 'home',
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
  selectedFilter: '为你推荐',
  isDarkMode: false,
  isLoading: false,
  currentPage: 1,
  
  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  toggleCreateMenu: () => set((state) => ({ 
    isCreateMenuOpen: !state.isCreateMenuOpen 
  })),
  
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  
  toggleLike: (artworkId) => set((state) => ({
    artworks: state.artworks.map(artwork =>
      artwork.id === artworkId
        ? {
            ...artwork,
            isLiked: !artwork.isLiked,
            stats: {
              ...artwork.stats,
              likes: artwork.isLiked 
                ? artwork.stats.likes - 1 
                : artwork.stats.likes + 1
            }
          }
        : artwork
    )
  })),
  
  toggleBookmark: (artworkId) => set((state) => ({
    artworks: state.artworks.map(artwork =>
      artwork.id === artworkId
        ? { ...artwork, isBookmarked: !artwork.isBookmarked }
        : artwork
    )
  })),
  
  toggleFollow: (artistId) => set((state) => {
    const isFollowing = state.followingList.includes(artistId);
    return {
      followingList: isFollowing
        ? state.followingList.filter(id => id !== artistId)
        : [...state.followingList, artistId],
      artists: state.artists.map(artist =>
        artist.id === artistId
          ? {
              ...artist,
              isFollowing: !artist.isFollowing,
              stats: {
                ...artist.stats,
                followers: artist.isFollowing 
                  ? artist.stats.followers - 1 
                  : artist.stats.followers + 1
              }
            }
          : artist
      )
    };
  }),
  
  becomeArtist: (profile) => set((state) => ({
    currentUser: state.currentUser ? {
      ...state.currentUser,
      name: profile.name,
      bio: profile.bio,
      tags: profile.tags,
      isArtist: true,
      avatar: 'https://via.placeholder.com/120',
      cover: 'https://via.placeholder.com/400x200/8b5cf6/ffffff?text=Art+Cover',
    } : null
  })),

  addArtwork: (artwork) => set((state) => ({
    currentUser: state.currentUser ? {
      ...state.currentUser,
      userArtworks: [...(state.currentUser.userArtworks || []), artwork],
      artworks: state.currentUser.artworks + 1,
    } : null
  })),

  followUser: (artistId) => set((state) => {
    if (!state.currentUser) return state;
    
    const isAlreadyFollowing = state.currentUser.followingList?.includes(artistId);
    if (isAlreadyFollowing) return state;

    return {
      // 更新当前用户的关注列表
      currentUser: {
        ...state.currentUser,
        followingList: [...(state.currentUser.followingList || []), artistId],
        following: state.currentUser.following + 1,
      },
      // 更新所有用户数据中被关注用户的粉丝列表
      allUsers: state.allUsers.map(user =>
        user.id === artistId
          ? {
              ...user,
              followersList: [...(user.followersList || []), state.currentUser!.id],
              followers: user.followers + 1,
            }
          : user
      ),
      // 更新艺术家列表中的关注状态
      artists: state.artists.map(artist =>
        artist.id === artistId
          ? {
              ...artist,
              isFollowing: true,
              stats: {
                ...artist.stats,
                followers: artist.stats.followers + 1,
              }
            }
          : artist
      ),
      // 更新旧的followingList以保持兼容性
      followingList: [...state.followingList, artistId],
    };
  }),

  unfollowUser: (artistId) => set((state) => {
    if (!state.currentUser) return state;
    
    const isFollowing = state.currentUser.followingList?.includes(artistId);
    if (!isFollowing) return state;

    return {
      // 更新当前用户的关注列表
      currentUser: {
        ...state.currentUser,
        followingList: (state.currentUser.followingList || []).filter(id => id !== artistId),
        following: Math.max(0, state.currentUser.following - 1),
      },
      // 更新所有用户数据中被取消关注用户的粉丝列表
      allUsers: state.allUsers.map(user =>
        user.id === artistId
          ? {
              ...user,
              followersList: (user.followersList || []).filter(id => id !== state.currentUser!.id),
              followers: Math.max(0, user.followers - 1),
            }
          : user
      ),
      // 更新艺术家列表中的关注状态
      artists: state.artists.map(artist =>
        artist.id === artistId
          ? {
              ...artist,
              isFollowing: false,
              stats: {
                ...artist.stats,
                followers: Math.max(0, artist.stats.followers - 1),
              }
            }
          : artist
      ),
      // 更新旧的followingList以保持兼容性
      followingList: state.followingList.filter(id => id !== artistId),
    };
  }),

  isUserFollowing: (artistId) => {
    const state = get();
    return state.currentUser?.followingList?.includes(artistId) || false;
  },

  toggleDarkMode: () => set((state) => ({ 
    isDarkMode: !state.isDarkMode 
  })),

  loadMockData: () => {
    // Mock data
    const mockUser: User = {
      id: 'user1',
      name: '我的主页',
      username: 'myprofile',
      email: 'user@example.com',
      isArtist: false,
      followers: 256,
      following: 89,
      artworks: 12,
      followersList: ['artist2'], // 王正春关注了我
      followingList: ['artist1'], // 我关注了杨西屏
    };
    
    const mockStories: Story[] = [
      {
        id: 'story1',
        user: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=9' },
        hasUpdate: true,
        gradient: ['#667eea', '#764ba2'],
      },
      {
        id: 'story2',
        user: { id: 'user1', name: '当前用户', avatar: 'https://via.placeholder.com/120' },
        hasUpdate: false,
        gradient: ['#667eea', '#764ba2'],
      },
      {
        id: 'story3',
        user: { id: 'artist2', name: '王正春', avatar: 'https://picsum.photos/120/120?random=2' },
        hasUpdate: false,
        gradient: ['#f093fb', '#f5576c'],
      },
    ];
    
    const mockArtworks: Artwork[] = [
      // 杨西屏作品
      {
        id: 'artwork1',
        title: '秋色',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=1' },
        image: 'https://picsum.photos/400/600?random=1001',
        gradient: ['#8B4513', '#D2691E'],
        stats: { likes: 2800, comments: 125 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork2',
        title: '蜀山韵味 I',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=1' },
        image: 'https://picsum.photos/400/600?random=1002',
        gradient: ['#2F4F4F', '#708090'],
        stats: { likes: 2100, comments: 89 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork3',
        title: '青山韵律',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=1' },
        image: 'https://picsum.photos/400/600?random=1003',
        gradient: ['#228B22', '#32CD32'],
        stats: { likes: 1950, comments: 67 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork4',
        title: '秋牧',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=1' },
        image: 'https://picsum.photos/400/600?random=1004',
        gradient: ['#CD853F', '#DEB887'],
        stats: { likes: 1680, comments: 45 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork5',
        title: '秋牧',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=4' },
        image: 'https://picsum.photos/400/600?random=1005',
        gradient: ['#CD853F', '#DEB887'],
        stats: { likes: 1580, comments: 42 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork6',
        title: '蜀山秋韵',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=8' },
        image: 'https://picsum.photos/400/600?random=1006',
        gradient: ['#8B4513', '#CD853F'],
        stats: { likes: 1750, comments: 55 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork7',
        title: '秋情',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=10' },
        image: 'https://picsum.photos/400/600?random=1007',
        gradient: ['#B8860B', '#DAA520'],
        stats: { likes: 1920, comments: 73 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork8',
        title: '蜀山秋色',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=8' },
        image: 'https://picsum.photos/400/600?random=1008',
        gradient: ['#8B4513', '#A0522D'],
        stats: { likes: 2050, comments: 88 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork9',
        title: '归蜀山',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=4' },
        image: 'https://picsum.photos/400/600?random=1009',
        gradient: ['#556B2F', '#6B8E23'],
        stats: { likes: 1650, comments: 51 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork10',
        title: '蜀山韵味 II',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=5' },
        image: 'https://picsum.photos/400/600?random=1010',
        gradient: ['#4682B4', '#87CEEB'],
        stats: { likes: 1850, comments: 72 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork11',
        title: '蜀江行',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=10' },
        image: 'https://picsum.photos/400/600?random=1011',
        gradient: ['#20B2AA', '#48D1CC'],
        stats: { likes: 1780, comments: 64 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork12',
        title: '无题 I',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=9' },
        image: 'https://picsum.photos/400/600?random=1012',
        gradient: ['#708090', '#778899'],
        stats: { likes: 1420, comments: 38 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork13',
        title: '无题 II',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=2' },
        image: 'https://picsum.photos/400/600?random=1013',
        gradient: ['#696969', '#808080'],
        stats: { likes: 1320, comments: 29 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork14',
        title: '无题 III',
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=3' },
        image: 'https://picsum.photos/400/600?random=1014',
        gradient: ['#2F4F4F', '#708090'],
        stats: { likes: 1580, comments: 47 },
        isLiked: false,
        isBookmarked: false,
      },
      // 王正春作品
      {
        id: 'artwork15',
        title: '蜀山春曲 136×68 (2025年)',
        artist: { id: 'artist2', name: '王正春', avatar: 'https://picsum.photos/120/120?random=2' },
        image: 'https://picsum.photos/400/600?random=1015',
        gradient: ['#4169E1', '#6495ED'],
        stats: { likes: 1420, comments: 38 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork16',
        title: '山高水长 68×36 (2025年)',
        artist: { id: 'artist2', name: '王正春', avatar: 'https://picsum.photos/120/120?random=9' },
        image: 'https://picsum.photos/400/600?random=1016',
        gradient: ['#DC143C', '#FF6347'],
        stats: { likes: 1180, comments: 29 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork17',
        title: '山水情韵 (2024年)',
        artist: { id: 'artist2', name: '王正春', avatar: 'https://picsum.photos/120/120?random=3' },
        image: 'https://picsum.photos/400/600?random=1017',
        gradient: ['#228B22', '#32CD32'],
        stats: { likes: 1350, comments: 42 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork18',
        title: '云山雾海 (2023年)',
        artist: { id: 'artist2', name: '王正春', avatar: 'https://picsum.photos/120/120?random=10' },
        image: 'https://picsum.photos/400/600?random=1018',
        gradient: ['#9370DB', '#BA55D3'],
        stats: { likes: 1620, comments: 51 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork19',
        title: '金秋山居 (2022年)',
        artist: { id: 'artist2', name: '王正春', avatar: 'https://picsum.photos/120/120?random=4' },
        image: 'https://picsum.photos/400/600?random=1019',
        gradient: ['#FF4500', '#FF8C00'],
        stats: { likes: 1890, comments: 67 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork20',
        title: '春山如黛 (2021年)',
        artist: { id: 'artist2', name: '王正春', avatar: 'https://picsum.photos/120/120?random=8' },
        image: 'https://picsum.photos/400/600?random=1020',
        gradient: ['#00CED1', '#40E0D0'],
        stats: { likes: 1450, comments: 35 },
        isLiked: false,
        isBookmarked: false,
      },
    ];
    
    const mockArtists: Artist[] = [
      {
        id: 'artist1',
        name: '杨西屏',
        avatar: 'https://picsum.photos/120/120?random=6',
        location: '中国水墨画家 · 成都',
        bio: '杨西屏，一九五八年生于四川省成都市，现为中原美术学院特聘教授，中国民主建国会民建中央画院院士，中央民建画院四川省分院副院长，香港职业书画家协会副主席，成都市民建书画院副院长。作品多次参加国内外美展并两次荣获中国文联批准的《中国百杰画家》称号，在迎上海世博会画展中被六家单位评审为《杰出书画艺术家最高荣誉成就奖》荣誉称号，作品入选庆祝中华人民共和国成立六十周年中国书画名家作品展，并荣获一等奖。',
        stats: { artworks: 14, followers: 2800, likes: 8900, curations: 5 },
        isFollowing: true,
      },
      {
        id: 'artist2',
        name: '王正春',
        avatar: 'https://picsum.photos/120/120?random=2',
        location: '花鸟山水画家 · 成都',
        bio: '王正春，1957年生于成都，先后在成都画院和朱常棣艺术工作室研修花鸟画和山水画。作品多次参加全国及省市美展并有获奖，曾八次入选中国美协主办的大展。2015年作品《金色羌山》获"三江源杯"全国书画展金奖。四川省山水画会委员，四川省美协会员，成都市美协理事，《中国书画報》特聘画师，蜀都书画院副秘书长。',
        stats: { artworks: 6, followers: 1650, likes: 5600, curations: 3 },
        isFollowing: false,
      },
    ];

    // 创建所有用户数据，包括艺术家
    const allMockUsers: User[] = [
      mockUser,
      {
        id: 'artist1',
        name: '杨西屏',
        username: 'yangxiping',
        email: 'yangxiping@example.com',
        isArtist: true,
        followers: 2800,
        following: 120,
        artworks: 14,
        avatar: 'https://picsum.photos/120/120?random=2',
        bio: '杨西屏，一九五八年生于四川省成都市，现为中原美术学院特聘教授，中国民主建国会民建中央画院院士，中央民建画院四川省分院副院长，香港职业书画家协会副主席，成都市民建书画院副院长。作品多次参加国内外美展并两次荣获中国文联批准的《中国百杰画家》称号，在迎上海世博会画展中被六家单位评审为《杰出书画艺术家最高荣誉成就奖》荣誉称号，作品入选庆祝中华人民共和国成立六十周年中国书画名家作品展，并荣获一等奖。',
        followersList: ['user1'], // 当前用户关注了杨西屏
        followingList: [],
      },
      {
        id: 'artist2',
        name: '王正春',
        username: 'wangzhengchun',
        email: 'wangzhengchun@example.com',
        isArtist: true,
        followers: 1650,
        following: 85,
        artworks: 6,
        avatar: 'https://picsum.photos/120/120?random=6',
        bio: '王正春，1957年生于成都，先后在成都画院和朱常棣艺术工作室研修花鸟画和山水画。作品多次参加全国及省市美展并有获奖，曾八次入选中国美协主办的大展。2015年作品《金色羌山》获"三江源杯"全国书画展金奖。四川省山水画会委员，四川省美协会员，成都市美协理事，《中国书画報》特聘画师，蜀都书画院副秘书长。',
        followersList: [],
        followingList: ['user1'], // 王正春关注了当前用户
      },
    ];
    
    const mockCurations: Curation[] = [
      {
        id: 'curation1',
        title: '东方美学的当代表达',
        curator: {
          id: 'curator1',
          name: '陈明',
          avatar: 'https://picsum.photos/120/120?random=10'
        },
        coverImage: 'https://picsum.photos/400/300?random=122',
        artworks: ['artwork1', 'artwork2'],
        views: 1200,
        likes: 89,
        isLiked: false,
        createdAt: '2024-03-01',
        description: '本次策展探讨传统东方美学在当代语境下的转译与重构。',
      },
      {
        id: 'curation2',
        title: '数字时代的水墨',
        curator: {
          id: 'curator2',
          name: '林小雨',
          avatar: 'https://picsum.photos/120/120?random=4'
        },
        coverImage: 'https://picsum.photos/400/300?random=123',
        artworks: ['artwork3', 'artwork4'],
        views: 890,
        likes: 67,
        isLiked: true,
        createdAt: '2024-02-01',
        description: '探索水墨艺术在数字时代的新表达方式。',
      },
      {
        id: 'curation3',
        title: '声音与色彩的交响',
        curator: {
          id: 'curator3',
          name: '王伟',
          avatar: 'https://picsum.photos/120/120?random=10'
        },
        coverImage: 'https://picsum.photos/400/300?random=124',
        artworks: ['artwork5', 'artwork6'],
        views: 1500,
        likes: 123,
        isLiked: false,
        createdAt: '2024-01-01',
        description: '多媒体艺术作品的视听盛宴。',
      },
      {
        id: 'curation4',
        title: '未来废墟：AI生成艺术',
        curator: {
          id: 'curator4',
          name: '科技艺术实验室',
          avatar: 'https://picsum.photos/120/120?random=10'
        },
        coverImage: 'https://picsum.photos/400/300?random=125',
        artworks: ['artwork7', 'artwork8'],
        views: 2100,
        likes: 156,
        isLiked: true,
        createdAt: '2024-04-01',
        description: '人工智能与艺术创作的前沿探索。',
      },
    ];
    
    set({
      currentUser: mockUser,
      stories: mockStories,
      artworks: mockArtworks,
      artists: mockArtists,
      curations: mockCurations,
      allUsers: allMockUsers,
      followingList: ['artist1'], // 用户关注杨西屏
    });
  },

  // 加载初始数据的函数
  loadInitialData: () => {
    const state = get();
    state.loadMockData();
  },

  // Authentication actions
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // 首先尝试真实 API
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
        const mockUser: User = {
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
          currentUser: mockUser, 
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

  register: async (userData) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: userData.name,
      username: userData.name.toLowerCase().replace(/\s+/g, ''),
      email: userData.email,
      isArtist: userData.isArtist,
      followers: 0,
      following: 0,
      artworks: 0,
      followersList: [],
      followingList: [],
      token: 'mock_jwt_token_' + Date.now(),
    };
    
    set({ 
      currentUser: newUser, 
      isLoading: false,
      allUsers: [...get().allUsers, newUser]
    });
    
    // Save to storage
    get().saveToStorage();
    
    return true;
  },

  logout: () => {
    set({ currentUser: null });
    // Clear storage
    get().saveToStorage();
  },

  // Board management
  createBoard: (name: string) => {
    const state = get();
    if (!state.currentUser) return;
    
    const newBoard: Board = {
      id: `board_${Date.now()}`,
      name,
      userId: get().currentUser?.id || 'user1',
      artworks: [],
      artworkIds: [],
      coverImage: null,
      createdAt: new Date().toISOString(),
    };
    
    set({ boards: [...state.boards, newBoard] });
    state.saveToStorage();
  },

  addArtworkToBoard: (boardId: string, artworkId: string) => {
    const state = get();
    const artwork = state.artworks.find(a => a.id === artworkId);
    if (!artwork) return;
    
    set({
      boards: state.boards.map(board =>
        board.id === boardId
          ? {
              ...board,
              artworks: [...board.artworks, artworkId],
              coverImage: board.coverImage || artwork.image
            }
          : board
      )
    });
    state.saveToStorage();
  },

  removeArtworkFromBoard: (boardId: string, artworkId: string) => {
    const state = get();
    
    set({
      boards: state.boards.map(board =>
        board.id === boardId
          ? {
              ...board,
              artworks: board.artworks.filter(id => id !== artworkId),
              coverImage: board.artworks.length === 1 ? null : board.coverImage
            }
          : board
      )
    });
    state.saveToStorage();
  },

  // Curation management
  createCuration: (curationData) => {
    const state = get();
    if (!state.currentUser) return;
    
    const newCuration: Curation = {
      ...curationData,
      id: 'curation_' + Date.now(),
      views: 0,
      likes: 0,
      isLiked: false,
    };
    
    set({ curations: [...state.curations, newCuration] });
    
    // Add notification for followers
    state.addNotification({
      type: 'curation',
      fromUserId: state.currentUser.id,
      fromUserName: state.currentUser.name,
      fromUserAvatar: state.currentUser.avatar || 'https://via.placeholder.com/40',
      targetId: newCuration.id,
      targetTitle: newCuration.title,
    });
    
    state.saveToStorage();
  },

  // Comment system
  addComment: (artworkId: string, text: string) => {
    const state = get();
    if (!state.currentUser) return;
    
    const newComment: Comment = {
      id: 'comment_' + Date.now(),
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      userAvatar: state.currentUser.avatar || 'https://via.placeholder.com/40',
      text,
      timestamp: new Date().toLocaleString('zh-CN'),
      likes: 0,
      isLiked: false,
    };
    
    set({
      comments: {
        ...state.comments,
        [artworkId]: [...(state.comments[artworkId] || []), newComment]
      }
    });
    
    // Add notification for artwork owner
    const artwork = state.artworks.find(a => a.id === artworkId);
    if (artwork && artwork.artist.id !== state.currentUser.id) {
      state.addNotification({
        type: 'comment',
        fromUserId: state.currentUser.id,
        fromUserName: state.currentUser.name,
        fromUserAvatar: state.currentUser.avatar || 'https://via.placeholder.com/40',
        targetId: artworkId,
        targetTitle: artwork.title,
      });
    }
    
    state.saveToStorage();
  },

  toggleCommentLike: (artworkId: string, commentId: string) => {
    const state = get();
    if (!state.currentUser) return;
    
    set({
      comments: {
        ...state.comments,
        [artworkId]: (state.comments[artworkId] || []).map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
              }
            : comment
        )
      }
    });
    
    state.saveToStorage();
  },

  // Notification system
  addNotification: (notificationData) => {
    const state = get();
    
    const newNotification: Notification = {
      ...notificationData,
      id: 'notification_' + Date.now(),
      timestamp: new Date().toLocaleString('zh-CN'),
      isRead: false,
    };
    
    set({ 
      notifications: [newNotification, ...state.notifications].slice(0, 100) // Keep only latest 100
    });
    
    state.saveToStorage();
  },

  markNotificationAsRead: (notificationId: string) => {
    const state = get();
    
    set({
      notifications: state.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    });
    
    state.saveToStorage();
  },

  // Pagination
  loadMoreArtworks: async () => {
    const state = get();
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock additional artworks
    const additionalArtworks: Artwork[] = [
      {
        id: 'artwork_page_' + (state.currentPage + 1) + '_1',
        title: '新作品 ' + (state.currentPage + 1),
        artist: { id: 'artist1', name: '杨西屏', avatar: 'https://picsum.photos/120/120?random=2' },
        image: 'https://picsum.photos/400/600?random=121',
        gradient: ['#8B4513', '#D2691E'],
        stats: { likes: Math.floor(Math.random() * 1000), comments: Math.floor(Math.random() * 50) },
        isLiked: false,
        isBookmarked: false,
      }
    ];
    
    set({
      artworks: [...state.artworks, ...additionalArtworks],
      currentPage: state.currentPage + 1,
      isLoading: false
    });
  },

  // Storage management
  saveToStorage: async () => {
    try {
      const state = get();
      const dataToSave = {
        currentUser: state.currentUser,
        followingList: state.followingList,
        savedArtworks: state.savedArtworks,
        boards: state.boards,
        comments: state.comments,
        notifications: state.notifications,
        isDarkMode: state.isDarkMode,
      };
      
      await AsyncStorage.setItem('nebula_app_data', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save data to storage:', error);
    }
  },

  loadFromStorage: async () => {
    try {
      const savedData = await AsyncStorage.getItem('nebula_app_data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        set({
          currentUser: parsedData.currentUser || null,
          followingList: parsedData.followingList || [],
          savedArtworks: parsedData.savedArtworks || [],
          boards: parsedData.boards || [],
          comments: parsedData.comments || {},
          notifications: parsedData.notifications || [],
          isDarkMode: parsedData.isDarkMode || false,
        });
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    }
  },
}));
