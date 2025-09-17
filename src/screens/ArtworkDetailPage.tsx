import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { theme } from '../theme/theme';
import HeartIcon from '../components/icons/HeartIcon';
import CommentIcon from '../components/icons/CommentIcon';
import BookmarkIcon from '../components/icons/BookmarkIcon';

const { width, height } = Dimensions.get('window');

interface ArtworkDetailPageProps {
  route: {
    params: {
      artworkId: string;
    };
  };
  navigation: any;
}

const ArtworkDetailPage: React.FC<any> = ({
  route,
  navigation,
}) => {
  const { artworkId } = route.params;
  const insets = useSafeAreaInsets();
  const { artworks, toggleLike, toggleBookmark } = useAppStore();
  
  const artwork = artworks.find(a => a.id === artworkId);
  
  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text>作品未找到</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>作品详情</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Artwork Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: artwork.image }}
          style={styles.artworkImage}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Artist */}
        <View style={styles.titleSection}>
          <Text style={styles.artworkTitle}>{artwork.title}</Text>
          <TouchableOpacity 
            style={styles.artistInfo}
            onPress={() => navigation.navigate('ArtistPage', { artistId: artwork.artist.id })}
          >
            <View style={styles.storyAvatar}>
              <Image
                source={{ uri: artwork.artist.avatar }}
                style={styles.artistAvatarImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.artistName}>{artwork.artist.name}</Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleLike(artwork.id)}
          >
            <HeartIcon 
              filled={artwork.isLiked} 
              color={artwork.isLiked ? theme.colors.primary : theme.colors.text}
            />
            <Text style={styles.actionText}>{artwork.stats.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <CommentIcon color={theme.colors.text} />
            <Text style={styles.actionText}>{artwork.stats.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleBookmark(artwork.id)}
          >
            <BookmarkIcon 
              filled={artwork.isBookmarked}
              color={artwork.isBookmarked ? theme.colors.primary : theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>作品介绍</Text>
          <Text style={styles.description}>
            这是一幅精美的艺术作品，展现了艺术家独特的创作风格和深厚的艺术功底。作品运用了丰富的色彩和精湛的技法，为观者带来了视觉上的享受和心灵上的震撼。
          </Text>
        </View>

        {/* Related Works */}
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>相关作品</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {artworks
              .filter(a => a.artist.id === artwork.artist.id && a.id !== artwork.id)
              .slice(0, 5)
              .map((relatedArtwork) => (
                <TouchableOpacity 
                  key={relatedArtwork.id} 
                  style={styles.relatedItem}
                  onPress={() => navigation.navigate('ArtworkDetailPage', { artworkId: relatedArtwork.id })}
                >
                  <Image
                    source={{ uri: relatedArtwork.image }}
                    style={styles.relatedImage}
                  />
                  <Text style={styles.relatedTitle} numberOfLines={1}>
                    {relatedArtwork.title}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: theme.colors.text,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    width: '90%',
    maxWidth: width * 0.9,
    alignSelf: 'center',
    aspectRatio: 1,
    marginVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: theme.spacing.lg,
  },
  titleSection: {
    marginBottom: theme.spacing.lg,
  },
  artworkTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
    overflow: 'hidden',
  },
  artistAvatarImage: {
    flex: 1,
    borderRadius: 18,
  },
  artistName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.xs,
  },
  actionText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  descriptionSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.fontSize.base,
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.base,
    color: theme.colors.textSecondary,
  },
  relatedSection: {
    marginBottom: theme.spacing.xl,
  },
  relatedItem: {
    marginRight: theme.spacing.md,
    width: 120,
  },
  relatedImage: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  relatedTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default ArtworkDetailPage;
