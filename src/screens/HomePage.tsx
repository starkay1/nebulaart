import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import {
  SearchIcon,
  NotificationIcon,
} from '../components/icons';
import { PinCard } from '../components/PinCard';
import { LoadingPlaceholder } from '../components/LoadingPlaceholder';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - theme.spacing.sm * 3) / 2;

interface StoryItemProps {
  story: any;
  onPress: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (story.hasUpdate) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [story.hasUpdate, pulseAnim]);

  return (
    <TouchableOpacity style={styles.storyItem} onPress={onPress}>
      <Animated.View style={[styles.storyAvatar, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.storyAvatarContainer}>
          <Image 
            source={{ uri: story.user.avatar }}
            style={styles.storyAvatarImage}
            resizeMode="cover"
            onError={(error) => console.log('Avatar load error:', error.nativeEvent.error)}
          />
        </View>
        {story.hasUpdate && <View style={styles.storyUpdateDot} />}
      </Animated.View>
      <Text style={styles.storyLabel} numberOfLines={1}>
        {story.user.name}
      </Text>
    </TouchableOpacity>
  );
};


export const HomePage: React.FC = () => {
  const navigation = useNavigation();
  const {
    stories,
    artworks,
    selectedFilter,
    setSelectedFilter,
    loadInitialData,
    toggleLike,
    toggleBookmark,
  } = useAppStore();
  
  const slideAnim = useRef(new Animated.Value(0)).current;

  const filters = [
    '为你推荐',
    '当代艺术',
    '油画',
    '水墨',
    '雕塑',
    '新媒体',
    '摄影',
    '版画',
  ];

  useEffect(() => {
    loadInitialData();
    
    // Start sliding animation for brand intro
    const startSlideAnimation = () => {
      Animated.loop(
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        })
      ).start();
    };
    
    startSlideAnimation();
  }, [slideAnim]);

  const renderStoryItem = ({ item }: { item: any }) => (
    <StoryItem
      story={item}
      onPress={() => {
        // Navigate to story or curation detail
        console.log('Story pressed:', item.user.name);
      }}
    />
  );

  const renderPinCard = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.pinCardContainer, { marginLeft: index % 2 === 0 ? 0 : theme.spacing.sm }]}>
      <PinCard
        artwork={item}
        onPress={() => {
          console.log('Artwork pressed:', item.id, item.title);
          (navigation as any).navigate('ArtworkDetailPage', { artworkId: item.id });
        }}
        onArtistPress={() => {
          console.log('Artist pressed:', item.artist.id, item.artist.name);
          (navigation as any).navigate('ArtistPage', { artistId: item.artist.id });
        }}
        onLikePress={() => toggleLike(item.id)}
        onBookmarkPress={() => toggleBookmark(item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Nebula</Text>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={theme.colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>搜索艺术作品、艺术家</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <NotificationIcon size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Brand Introduction */}
        <View style={styles.brandIntro}>
          <View style={styles.brandTextContainer}>
            <Animated.Text 
              style={[
                styles.brandIntroText,
                {
                  transform: [{
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, -300],
                    })
                  }]
                }
              ]}
            >
              星云艺术（Nebula Art）是一个专注于中国当代艺术的数字社区，致力于连接艺术家与收藏家，让传统美学在数字时代重新呼吸。
            </Animated.Text>
          </View>
        </View>

        {/* Stories */}
        <View style={styles.storiesContainer}>
          <FlatList
            data={stories}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScroll}
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterPills}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterPill,
                    selectedFilter === filter && styles.filterPillActive,
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      selectedFilter === filter && styles.filterPillTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Masonry Grid */}
        <View style={styles.masonryContainer}>
          <FlatList
            data={artworks}
            renderItem={renderPinCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.masonryContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  logo: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.primary,
    letterSpacing: theme.letterSpacing.tight,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.textLight,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.xs,
  },
  content: {
    flex: 1,
  },
  storiesContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
  },
  storiesScroll: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  storyItem: {
    alignItems: 'center',
  },
  storyAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: theme.spacing.xs,
    position: 'relative',
  },
  storyAvatarContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: theme.colors.gray100,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    padding: 2,
    overflow: 'hidden',
  },
  storyAvatarImage: {
    flex: 1,
    borderRadius: 30,
  },
  storyUpdateDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: theme.colors.success,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  storyLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    width: 68,
    textAlign: 'center',
  },
  filterContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterPills: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.xs,
  },
  filterPillActive: {
    backgroundColor: theme.colors.text,
  },
  filterPillText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  filterPillTextActive: {
    color: theme.colors.surface,
  },
  masonryContainer: {
    padding: theme.spacing.sm,
  },
  masonryContent: {
    paddingBottom: theme.spacing.xl,
  },
  pinCardContainer: {
    width: COLUMN_WIDTH,
    marginBottom: theme.spacing.sm,
  },
  brandIntro: {
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    height: 60,
    overflow: 'hidden',
  },
  brandTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIntroText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 1.8,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
});
