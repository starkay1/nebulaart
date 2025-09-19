import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useAppStore, Artwork } from '../store/appStore';
import {
  SearchIcon,
  NotificationIcon,
} from '../components/icons';
import PinCard from '../components/PinCard';
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
    loadMoreArtworks,
    isLoading,
  } = useAppStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState('latest'); // latest, popular, trending
  const [showSortModal, setShowSortModal] = useState(false);
  
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
        // Navigate to artist page
        if (item.user.id !== 'user1') {
          (navigation as any).navigate('ArtistPage', { artistId: item.user.id });
        }
      }}
    />
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    loadInitialData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLoadMore = () => {
    if (!isLoading) {
      loadMoreArtworks();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredArtworks = artworks.filter((artwork: Artwork) => {
    const matchesSearch = searchQuery === '' || 
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === '为你推荐' || selectedFilter === '全部' ||
      artwork.title.toLowerCase().includes(selectedFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  }).sort((a: Artwork, b: Artwork) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes || 0) - (a.likes || 0);
      case 'trending':
        return (b.views || 0) - (a.views || 0);
      case 'latest':
      default:
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    }
  });

  const sortOptions = [
    { key: 'latest', label: '最新发布' },
    { key: 'popular', label: '最受欢迎' },
    { key: 'trending', label: '热门趋势' },
  ];

  // 缓存随机因子，避免每次重新计算
  const randomFactors = useMemo(() => {
    return artworks.reduce((acc: Record<string, { artistScore: number; diversityScore: number }>, artwork: Artwork) => {
      acc[artwork.id] = {
        artistScore: Math.random() * 100 * 0.1,
        diversityScore: Math.random() * 0.3
      };
      return acc;
    }, {} as Record<string, { artistScore: number; diversityScore: number }>);
  }, [artworks.length]); // 只有作品数量变化时才重新生成

  // 智能推荐算法 - 使用useMemo优化性能
  const recommendedArtworks = useMemo(() => {
    if (selectedFilter !== '为你推荐') return filteredArtworks;
    
    // 基于用户行为的推荐算法
    const userPreferences = {
      likedArtists: [], // 用户点赞过的艺术家
      viewedCategories: ['当代艺术', '油画'], // 用户浏览过的分类
      interactionScore: {}, // 互动评分
    };

    const nowTime = Date.now();

    return [...filteredArtworks].sort((a: Artwork, b: Artwork) => {
      let scoreA = 0;
      let scoreB = 0;

      // 基于点赞数的推荐权重
      scoreA += (a.stats?.likes || 0) * 0.3;
      scoreB += (b.stats?.likes || 0) * 0.3;

      // 基于浏览量的推荐权重（使用评论数作为活跃度指标）
      scoreA += (a.stats?.comments || 0) * 0.2;
      scoreB += (b.stats?.comments || 0) * 0.2;

      // 基于时间的新鲜度权重
      const aTime = new Date(a.createdAt || '').getTime();
      const bTime = new Date(b.createdAt || '').getTime();
      const aDaysDiff = (nowTime - aTime) / (1000 * 60 * 60 * 24);
      const bDaysDiff = (nowTime - bTime) / (1000 * 60 * 60 * 24);
      
      scoreA += Math.max(0, 30 - aDaysDiff) * 0.1; // 30天内的作品有新鲜度加分
      scoreB += Math.max(0, 30 - bDaysDiff) * 0.1;

      // 使用缓存的随机因子
      const factorA = randomFactors[a.id];
      const factorB = randomFactors[b.id];
      
      if (factorA) {
        scoreA += factorA.artistScore + factorA.diversityScore;
      }
      if (factorB) {
        scoreB += factorB.artistScore + factorB.diversityScore;
      }

      return scoreB - scoreA;
    });
  }, [filteredArtworks, selectedFilter, randomFactors]);

  const renderPinCard = useCallback(({ item, index }: { item: Artwork; index: number }) => (
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
  ), [navigation, toggleLike, toggleBookmark]);

  const renderLoadMoreButton = () => {
    if (isLoading) {
      return (
        <View style={styles.loadMoreContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>加载更多作品中...</Text>
        </View>
      );
    }
    
    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
        <Text style={styles.loadMoreText}>加载更多</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Nebula</Text>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setShowSearch(!showSearch)}
        >
          <SearchIcon size={20} color={theme.colors.textSecondary} />
          {showSearch ? (
            <TextInput
              style={styles.searchInput}
              placeholder="搜索艺术作品、艺术家"
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          ) : (
            <Text style={styles.searchPlaceholder}>搜索艺术作品、艺术家</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconBtn}
          onPress={() => (navigation as any).navigate('NotificationPage')}
        >
          <NotificationIcon size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
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
            data={recommendedArtworks}
            renderItem={renderPinCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.masonryContent}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={6}
            getItemLayout={(data, index) => ({
              length: 280, // 估算的item高度
              offset: 280 * Math.floor(index / 2),
              index,
            })}
          />
          
          {/* Load More Section */}
          {artworks.length > 0 && renderLoadMoreButton()}
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
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    paddingVertical: 0,
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
    lineHeight: theme.lineHeight.loose,
    textAlign: 'center',
  },
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  loadMoreButton: {
    alignSelf: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  loadMoreText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
});
