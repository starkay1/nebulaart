import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { theme } from '../theme/theme';

interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    stats: {
      followers: number;
      artworks: number;
    };
    isFollowing?: boolean;
    hasStoryUpdate?: boolean;
  };
  onPress: () => void;
  onFollowPress?: () => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onPress,
  onFollowPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <View style={[styles.storyAvatar, artist.hasStoryUpdate && styles.storyAvatarActive]}>
          <Image source={{ uri: artist.avatar }} style={styles.avatar} />
          {artist.hasStoryUpdate && <View style={styles.storyUpdateDot} />}
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.artistName} numberOfLines={1}>
          {artist.name}
        </Text>
        <Text style={styles.artistLocation} numberOfLines={1}>
          {artist.location}
        </Text>
        
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {artist.stats.followers} 关注者
          </Text>
          <Text style={styles.statText}>
            {artist.stats.artworks} 作品
          </Text>
        </View>
      </View>
      
      {onFollowPress && (
        <TouchableOpacity
          style={[styles.followBtn, artist.isFollowing && styles.followBtnActive]}
          onPress={onFollowPress}
        >
          <Text style={[styles.followBtnText, artist.isFollowing && styles.followBtnTextActive]}>
            {artist.isFollowing ? '已关注' : '关注'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.gray100,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    position: 'relative',
    overflow: 'hidden',
  },
  storyAvatarActive: {
    borderColor: theme.colors.primary,
  },
  avatar: {
    flex: 1,
    borderRadius: 26,
  },
  storyUpdateDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  content: {
    flex: 1,
  },
  artistName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxs,
  },
  artistLocation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  followBtn: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.xs,
  },
  followBtnActive: {
    backgroundColor: theme.colors.gray100,
  },
  followBtnText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.surface,
  },
  followBtnTextActive: {
    color: theme.colors.text,
  },
});
