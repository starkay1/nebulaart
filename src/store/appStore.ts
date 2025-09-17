import { create } from 'zustand';

export interface UserArtwork {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  isArtist: boolean;
  followers: number;
  following: number;
  artworks: number;
  avatar?: string;
  cover?: string;
  bio?: string;
  tags?: string[];
  userArtworks?: UserArtwork[];
  followersList?: string[]; // 关注我的用户 ID 列表
  followingList?: string[]; // 我关注的用户 ID 列表
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  location: string;
  bio: string;
  stats: {
    artworks: number;
    followers: number;
    curations: number;
  };
  isFollowing: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
    avatar: string;
  };
  image: string;
  gradient: string[];
  stats: {
    likes: number;
    comments: number;
  };
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface Curation {
  id: string;
  title: string;
  curator: string;
  date: string;
  cover: string[];
  artworkCount: number;
  description: string;
}

export interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  hasUpdate: boolean;
  gradient: string[];
}

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
  followingList: string[];
  allUsers: User[]; // 存储所有用户数据，用于双向关注逻辑
  
  // UI State
  isCreateMenuOpen: boolean;
  selectedFilter: string;
  isDarkMode: boolean;
  
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
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentUser: null,
  currentTab: 'home',
  stories: [],
  artworks: [],
  artists: [],
  curations: [],
  followingList: [],
  allUsers: [],
  isCreateMenuOpen: false,
  selectedFilter: '为你推荐',
  isDarkMode: false,
  
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
        user: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
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
        user: { id: 'artist2', name: '王正春', avatar: './images/artists/wangzhengchun_avatar.jpg' },
        hasUpdate: false,
        gradient: ['#f093fb', '#f5576c'],
      },
    ];
    
    const mockArtworks: Artwork[] = [
      // 杨西屏作品
      {
        id: 'artwork1',
        title: '秋色',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/autumn_colors.jpg',
        gradient: ['#8B4513', '#D2691E'],
        stats: { likes: 2800, comments: 125 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork2',
        title: '蜀山韵味 I',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/shu_mountains_charm_1.jpg',
        gradient: ['#2F4F4F', '#708090'],
        stats: { likes: 2100, comments: 89 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork3',
        title: '青山韵律',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/rhythm_of_green_hills.jpg',
        gradient: ['#228B22', '#32CD32'],
        stats: { likes: 1950, comments: 67 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork4',
        title: '秋牧',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/morning_charm.jpg',
        gradient: ['#CD853F', '#DEB887'],
        stats: { likes: 1680, comments: 45 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork5',
        title: '秋牧',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/autumn_herding.jpg',
        gradient: ['#CD853F', '#DEB887'],
        stats: { likes: 1580, comments: 42 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork6',
        title: '蜀山秋韵',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/autumn_rhythm_shu_mountains.jpg',
        gradient: ['#8B4513', '#CD853F'],
        stats: { likes: 1750, comments: 55 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork7',
        title: '秋情',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/autumn_sentiment.jpg',
        gradient: ['#B8860B', '#DAA520'],
        stats: { likes: 1920, comments: 73 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork8',
        title: '蜀山秋色',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/autumn_in_shu_mountains.jpg',
        gradient: ['#8B4513', '#A0522D'],
        stats: { likes: 2050, comments: 88 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork9',
        title: '归蜀山',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/return_to_shu_mountains.jpg',
        gradient: ['#556B2F', '#6B8E23'],
        stats: { likes: 1650, comments: 51 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork10',
        title: '蜀山韵味 II',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/shu_mountains_charm_2.jpg',
        gradient: ['#4682B4', '#87CEEB'],
        stats: { likes: 1850, comments: 72 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork11',
        title: '蜀江行',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/traveling_shu_river.jpg',
        gradient: ['#20B2AA', '#48D1CC'],
        stats: { likes: 1780, comments: 64 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork12',
        title: '无题 I',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/untitled_1.jpg',
        gradient: ['#708090', '#778899'],
        stats: { likes: 1420, comments: 38 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork13',
        title: '无题 II',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/untitled_2.jpg',
        gradient: ['#696969', '#808080'],
        stats: { likes: 1320, comments: 29 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork14',
        title: '无题 III',
        artist: { id: 'artist1', name: '杨西屏', avatar: './images/artists/yangxiping_avatar.jpg' },
        image: './images/artworks/untitled_3.jpg',
        gradient: ['#2F4F4F', '#708090'],
        stats: { likes: 1580, comments: 47 },
        isLiked: false,
        isBookmarked: false,
      },
      // 王正春作品
      {
        id: 'artwork15',
        title: '蜀山春曲 136×68 (2025年)',
        artist: { id: 'artist2', name: '王正春', avatar: './images/artists/wangzhengchun_avatar.jpg' },
        image: './images/artworks/wangzhengchun_1.jpg',
        gradient: ['#4169E1', '#6495ED'],
        stats: { likes: 1420, comments: 38 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork16',
        title: '山高水长 68×36 (2025年)',
        artist: { id: 'artist2', name: '王正春', avatar: './images/artists/wangzhengchun_avatar.jpg' },
        image: './images/artworks/wangzhengchun_2.jpg',
        gradient: ['#DC143C', '#FF6347'],
        stats: { likes: 1180, comments: 29 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork17',
        title: '山水情韵 (2024年)',
        artist: { id: 'artist2', name: '王正春', avatar: './images/artists/wangzhengchun_avatar.jpg' },
        image: './images/artworks/wangzhengchun_3.jpg',
        gradient: ['#228B22', '#32CD32'],
        stats: { likes: 1350, comments: 42 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork18',
        title: '云山雾海 (2023年)',
        artist: { id: 'artist2', name: '王正春', avatar: './images/artists/wangzhengchun_avatar.jpg' },
        image: './images/artworks/wangzhengchun_4.jpg',
        gradient: ['#9370DB', '#BA55D3'],
        stats: { likes: 1620, comments: 51 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork19',
        title: '金秋山居 (2022年)',
        artist: { id: 'artist2', name: '王正春', avatar: './images/artists/wangzhengchun_avatar.jpg' },
        image: './images/artworks/wangzhengchun_5.jpg',
        gradient: ['#FF4500', '#FF8C00'],
        stats: { likes: 1890, comments: 67 },
        isLiked: false,
        isBookmarked: false,
      },
      {
        id: 'artwork20',
        title: '春山如黛 (2021年)',
        artist: { id: 'artist2', name: '王正春', avatar: './images/artists/wangzhengchun_avatar.jpg' },
        image: './images/artworks/wangzhengchun_6.jpg',
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
        avatar: './images/artists/yangxiping_avatar.jpg',
        location: '中国水墨画家 · 成都',
        bio: '杨西屏，一九五八年生于四川省成都市，现为中原美术学院特聘教授，中国民主建国会民建中央画院院士，中央民建画院四川省分院副院长，香港职业书画家协会副主席，成都市民建书画院副院长。作品多次参加国内外美展并两次荣获中国文联批准的《中国百杰画家》称号，在迎上海世博会画展中被六家单位评审为《杰出书画艺术家最高荣誉成就奖》荣誉称号，作品入选庆祝中华人民共和国成立六十周年中国书画名家作品展，并荣获一等奖。',
        stats: { artworks: 14, followers: 2800, curations: 5 },
        isFollowing: true,
      },
      {
        id: 'artist2',
        name: '王正春',
        avatar: './images/artists/wangzhengchun_avatar.jpg',
        location: '花鸟山水画家 · 成都',
        bio: '王正春，1957年生于成都，先后在成都画院和朱常棣艺术工作室研修花鸟画和山水画。作品多次参加全国及省市美展并有获奖，曾八次入选中国美协主办的大展。2015年作品《金色羌山》获"三江源杯"全国书画展金奖。四川省山水画会委员，四川省美协会员，成都市美协理事，《中国书画報》特聘画师，蜀都书画院副秘书长。',
        stats: { artworks: 6, followers: 1650, curations: 3 },
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
        avatar: './images/artists/yangxiping_avatar.jpg',
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
        avatar: './images/artists/wangzhengchun_avatar.jpg',
        bio: '王正春，1957年生于成都，先后在成都画院和朱常棣艺术工作室研修花鸟画和山水画。作品多次参加全国及省市美展并有获奖，曾八次入选中国美协主办的大展。2015年作品《金色羌山》获"三江源杯"全国书画展金奖。四川省山水画会委员，四川省美协会员，成都市美协理事，《中国书画報》特聘画师，蜀都书画院副秘书长。',
        followersList: [],
        followingList: ['user1'], // 王正春关注了当前用户
      },
    ];
    
    const mockCurations: Curation[] = [
      {
        id: 'curation1',
        title: '东方美学的当代表达',
        curator: '陈明',
        date: '2024年3月',
        cover: ['#667eea', '#764ba2'],
        artworkCount: 12,
        description: '本次策展探讨传统东方美学在当代语境下的转译与重构。',
      },
      {
        id: 'curation2',
        title: '数字时代的水墨',
        curator: '林小雨',
        date: '2024年2月',
        cover: ['#f093fb', '#f5576c'],
        artworkCount: 8,
        description: '探索水墨艺术在数字时代的新表达方式。',
      },
      {
        id: 'curation3',
        title: '声音与色彩的交响',
        curator: '王伟',
        date: '2024年1月',
        cover: ['#4facfe', '#00f2fe'],
        artworkCount: 15,
        description: '多媒体艺术作品的视听盛宴。',
      },
      {
        id: 'curation4',
        title: '未来废墟：AI生成艺术',
        curator: '科技艺术实验室',
        date: '2024年4月',
        cover: ['#fa709a', '#fee140'],
        artworkCount: 20,
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
    const store = get();
    if (!store.currentUser) {
      // 调用 loadMockData 方法
      store.loadMockData();
    }
  },
}));
