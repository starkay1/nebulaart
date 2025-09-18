export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  cover?: string;
  bio?: string;
  tags?: string[];
  isArtist: boolean;
  followers: number;
  following: number;
  artworks: number;
  followersList?: string[];
  followingList?: string[];
  userArtworks?: UserArtwork[];
  token?: string;
  stats?: {
    followers: number;
    artworks: number;
    likes: number;
  };
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  cover?: string;
  location?: string;
  bio: string;
  tags?: string[];
  stats: {
    followers: number;
    artworks: number;
    likes: number;
    curations?: number;
  };
  isFollowing: boolean;
  hasStoryUpdate?: boolean;
  artworks?: Artwork[];
}

export interface Artwork {
  id: string;
  title: string;
  image: string;
  artist: {
    id: string;
    name: string;
    avatar: string;
  };
  gradient: string[];
  stats: {
    likes: number;
    comments: number;
  };
  isLiked: boolean;
  isBookmarked: boolean;
  aspectRatio?: number;
}

export interface UserArtwork {
  id: string;
  title: string;
  description: string;
  image: string;
  artistId: string;
  createdAt: string;
  stats: {
    likes: number;
    comments: number;
  };
  isLiked: boolean;
  isBookmarked: boolean;
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

export interface Curation {
  id: string;
  title: string;
  description: string;
  curator: {
    id: string;
    name: string;
    avatar: string;
  };
  artworks: string[];
  coverImage: string;
  cover?: string[];
  views: number;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  userId: string;
  artworkIds: string[];
  coverImage: string | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'share' | 'curation';
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  targetId: string;
  targetTitle?: string;
  message?: string;
  timestamp: string;
  isRead: boolean;
}

export type TabName = 'home' | 'curation' | 'artist' | 'profile';
