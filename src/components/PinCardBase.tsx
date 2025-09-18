import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { Artwork } from '../store/appStore';
import { HeartIcon, BookmarkIcon, ShareIcon } from './icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.sm * 3) / 2;

interface PinCardBaseProps {
  artwork: Artwork;
  onPress: () => void;
  onLike?: (artworkId: string) => void;
  onBookmark?: (artworkId: string) => void;
  onShare?: (artwork: Artwork) => void;
  showActions?: boolean;
  style?: any;
}

export const PinCardBase: React.FC<PinCardBaseProps> = ({
  artwork,
  onPress,
  onLike,
  onBookmark,
  onShare,
  showActions = true,
  style,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = () => {
    onLike?.(artwork.id);
  };

  const handleBookmark = () => {
    onBookmark?.(artwork.id);
  };

  const handleShare = () => {
    onShare?.(artwork);
  };

  const renderPlaceholder = () => (
    <LinearGradient
      colors={['#f3f4f6', '#e5e7eb']}
      style={[styles.image, styles.placeholder]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.placeholderText}>图片加载失败</Text>
    </LinearGradient>
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {imageError ? (
          renderPlaceholder()
        ) : (
          <Image
            source={{ 
              uri: artwork.image,
            }}
            style={styles.image}
            resizeMode={"cover"}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
          />
        )}
        
        {!imageLoaded && !imageError && (
          <LinearGradient
            colors={['#f3f4f6', '#e5e7eb']}
            style={[styles.image, styles.loadingPlaceholder]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}

        {showActions && imageLoaded && (
          <View style={styles.overlay}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.gradient}
            />
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLike}
              >
                <HeartIcon
                  size={20}
                  color="white"
                  filled={artwork.isLiked}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleBookmark}
              >
                <BookmarkIcon
                  size={20}
                  color="white"
                  filled={artwork.isBookmarked}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <ShareIcon size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {artwork.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artwork.artist.name}
        </Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {artwork.stats.likes} 喜欢
          </Text>
          <Text style={styles.statText}>
            {artwork.stats.comments} 评论
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholderText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  gradient: {
    flex: 1,
  },
  actions: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.lineHeight.tight,
  },
  artist: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
});
