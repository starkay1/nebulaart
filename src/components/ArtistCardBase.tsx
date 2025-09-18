import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { Artist } from '../store/appStore';

interface ArtistCardBaseProps {
  artist: Artist;
  onPress: () => void;
  onFollow?: (artistId: string) => void;
  showFollowButton?: boolean;
  variant?: 'list' | 'detail';
  style?: any;
}

export const ArtistCardBase: React.FC<ArtistCardBaseProps> = ({
  artist,
  onPress,
  onFollow,
  showFollowButton = true,
  variant = 'list',
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleFollow = () => {
    onFollow?.(artist.id);
  };

  const renderPlaceholder = () => (
    <LinearGradient
      colors={['#f3f4f6', '#e5e7eb']}
      style={styles.avatarPlaceholder}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.avatarPlaceholderText}>
        {artist.name.charAt(0)}
      </Text>
    </LinearGradient>
  );

  const isDetailVariant = variant === 'detail';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isDetailVariant && styles.detailContainer,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[
          styles.avatar,
          isDetailVariant && styles.detailAvatar,
        ]}>
          {imageError ? (
            renderPlaceholder()
          ) : (
            <Image
              source={{ uri: artist.avatar }}
              style={[
                styles.avatarImage,
                ...(isDetailVariant ? [styles.detailAvatarImage] : []),
              ]}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          )}
        </View>

        <View style={[
          styles.info,
          isDetailVariant && styles.detailInfo,
        ]}>
          <Text style={[
            styles.name,
            isDetailVariant && styles.detailName,
          ]} numberOfLines={1}>
            {artist.name}
          </Text>
          <Text style={[
            styles.location,
            isDetailVariant && styles.detailLocation,
          ]} numberOfLines={1}>
            {artist.location}
          </Text>
          {isDetailVariant && (
            <Text style={styles.bio} numberOfLines={2}>
              {artist.bio}
            </Text>
          )}
          <View style={[
            styles.stats,
            isDetailVariant && styles.detailStats,
          ]}>
            <Text style={styles.statText}>
              {artist.stats.artworks} 作品
            </Text>
            <Text style={styles.statText}>
              {artist.stats.followers} 关注者
            </Text>
            <Text style={styles.statText}>
              {artist.stats.curations} 策展
            </Text>
          </View>
        </View>

        {showFollowButton && (
          <TouchableOpacity
            style={[
              styles.followButton,
              artist.isFollowing && styles.followingButton,
              isDetailVariant && styles.detailFollowButton,
            ]}
            onPress={handleFollow}
          >
            {artist.isFollowing ? (
              <Text style={[
                styles.followButtonText,
                styles.followingButtonText,
              ]}>
                已关注
              </Text>
            ) : (
              <LinearGradient
                colors={[...theme.gradients.primary]}
                style={styles.followButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.followButtonText}>关注</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  detailContainer: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  detailAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  detailAvatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: 'white',
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  detailInfo: {
    marginLeft: theme.spacing.lg,
  },
  name: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  detailName: {
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.sm,
  },
  location: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  detailLocation: {
    fontSize: theme.fontSize.md,
  },
  bio: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.relaxed,
    marginBottom: theme.spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  detailStats: {
    gap: theme.spacing.lg,
  },
  statText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
  followButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    minWidth: 60,
    height: 32,
  },
  detailFollowButton: {
    minWidth: 80,
    height: 40,
  },
  followingButton: {
    backgroundColor: theme.colors.border,
  },
  followButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  followButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: 'white',
    textAlign: 'center',
  },
  followingButtonText: {
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
});
