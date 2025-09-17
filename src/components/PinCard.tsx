import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { LoadingPlaceholder } from './LoadingPlaceholder';
import {
  HeartIcon,
  CommentIcon,
  BookmarkIcon,
  ShareIcon,
  MoreIcon,
} from './icons';

interface PinCardProps {
  artwork: {
    id: string;
    title: string;
    image: string;
    artist: {
      id: string;
      name: string;
      avatar: string;
    };
    stats: {
      likes: number;
      comments: number;
    };
    isLiked?: boolean;
    isBookmarked?: boolean;
    aspectRatio?: number;
  };
  onPress: () => void;
  onArtistPress: () => void;
  onLikePress?: () => void;
  onBookmarkPress?: () => void;
}

export const PinCard: React.FC<PinCardProps> = ({
  artwork,
  onPress,
  onArtistPress,
  onLikePress,
  onBookmarkPress,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Calculate height based on aspect ratio or use default
  const baseWidth = (Dimensions.get('window').width - theme.spacing.lg * 3) / 2;
  const aspectRatio = artwork.aspectRatio || (0.7 + Math.random() * 0.6);
  const calculatedHeight = Math.max(150, Math.min(300, baseWidth / aspectRatio));
  const placeholderHeight = calculatedHeight * 0.7;

  return (
    <TouchableOpacity style={styles.pinCard} onPress={onPress}>
      <View style={[styles.pinImage, { height: calculatedHeight }]}>
        {!imageLoaded && !imageError && (
          <LoadingPlaceholder
            height={placeholderHeight}
            borderRadius={theme.borderRadius.lg}
          />
        )}
        
        {!imageError && (
          <Image
            source={{ uri: artwork.image }}
            style={styles.pinGradient}
            resizeMode="cover"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
          />
        )}
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.pinGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        
        <View style={styles.pinOverlay}>
          <View style={styles.pinActions}>
            <TouchableOpacity
              style={styles.pinActionBtn}
              onPress={onBookmarkPress}
            >
              <BookmarkIcon 
                size={16} 
                color={artwork.isBookmarked ? theme.colors.primary : theme.colors.text} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pinActionBtn}>
              <ShareIcon size={16} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pinActionBtn}>
              <MoreIcon size={16} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.pinInfo}>
        <Text style={styles.pinTitle} numberOfLines={2}>
          {artwork.title}
        </Text>
        
        <TouchableOpacity style={styles.pinArtist} onPress={onArtistPress}>
          <View style={styles.storyAvatar}>
            <Image 
              source={{ uri: artwork.artist.avatar }} 
              style={styles.pinArtistAvatarImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.pinArtistName}>{artwork.artist.name}</Text>
        </TouchableOpacity>
        
        <View style={styles.pinStats}>
          <TouchableOpacity
            style={styles.pinStat}
            onPress={onLikePress}
          >
            <HeartIcon
              size={14}
              color={artwork.isLiked ? theme.colors.danger : theme.colors.textLight}
              filled={artwork.isLiked}
            />
            <Text style={styles.pinStatText}>
              {artwork.stats.likes > 1000
                ? `${(artwork.stats.likes / 1000).toFixed(1)}k`
                : artwork.stats.likes}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.pinStat}>
            <CommentIcon size={14} color={theme.colors.textLight} />
            <Text style={styles.pinStatText}>{artwork.stats.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pinCard: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  pinImage: {
    width: '100%',
    position: 'relative',
  },
  pinGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  pinOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: 0,
  },
  pinActions: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  pinActionBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.xs,
  },
  pinInfo: {
    padding: theme.spacing.md,
  },
  pinTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.lineHeight.tight * theme.fontSize.sm,
  },
  pinArtist: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  storyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.gray100,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    overflow: 'hidden',
  },
  pinArtistAvatarImage: {
    flex: 1,
    borderRadius: 10,
  },
  pinArtistName: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  pinStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  pinStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 6,
  },
  pinStatText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
});
