import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import { SearchIcon, FilterIcon } from '../components/icons';

export const CurationCenterPage: React.FC = () => {
  const navigation = useNavigation();
  const { artists, artworks } = useAppStore();

  // Create exhibition data using real artists
  const exhibitions = [
    {
      id: 'exhibition1',
      title: '杨西屏艺术回顾展',
      curator: '杨西屏',
      description: '展现传统与现代融合的艺术魅力，探索中国山水画的当代表达。',
      artist: artists.find(a => a.id === 'artist1'),
      artworks: artworks.filter(a => a.artist.id === 'artist1'),
      coverImage: '/images/curations/yangxiping_retrospective.jpg',
      views: 3200,
      likes: 156,
    },
    {
      id: 'exhibition2',
      title: '王正春当代艺术展',
      curator: '王正春',
      description: '当代艺术的新视角，用现代手法诠释传统文化内涵。',
      artist: artists.find(a => a.id === 'artist2'),
      artworks: artworks.filter(a => a.artist.id === 'artist2'),
      coverImage: '/images/curations/wangzhengchun_contemporary.jpg',
      views: 2800,
      likes: 128,
    },
    {
      id: 'exhibition3',
      title: '新锐艺术家联展',
      curator: '策展团队',
      description: '汇聚新生代艺术家的创新作品，展现当代艺术的多元化发展。',
      artist: null,
      artworks: artworks.slice(0, 8),
      coverImage: '/images/curations/emerging_artists_group.jpg',
      views: 1950,
      likes: 89,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>策展中心</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <SearchIcon size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <FilterIcon size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Exhibitions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>精选展览</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {exhibitions.map((exhibition) => (
              <TouchableOpacity 
                key={exhibition.id} 
                style={styles.featuredCard}
                onPress={() => {
                  console.log('Navigating to curation:', exhibition.id);
                  (navigation as any).navigate('CurationDetail', { curationId: exhibition.id });
                }}
              >
                <Image 
                  source={exhibition.id === 'exhibition1' 
                    ? require('../../public/images/curations/yangxiping_retrospective_small.jpg')
                    : exhibition.id === 'exhibition2'
                    ? require('../../public/images/curations/wangzhengchun_contemporary.jpg')
                    : require('../../public/images/curations/emerging_artists_group.jpg')
                  }
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.featuredOverlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>{exhibition.title}</Text>
                  <Text style={styles.featuredSubtitle}>策展人: {exhibition.curator}</Text>
                  <Text style={styles.featuredStats}>
                    {exhibition.artworks.length} 件作品 · {exhibition.views} 次浏览 · {exhibition.likes} 喜欢
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Artist Exhibitions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>艺术家个展</Text>
          {exhibitions.map((exhibition) => (
            <TouchableOpacity 
              key={exhibition.id} 
              style={styles.exhibitionCard}
              onPress={() => {
                console.log('Navigating to curation:', exhibition.id);
                (navigation as any).navigate('CurationDetail', { curationId: exhibition.id });
              }}
            >
              <View style={styles.exhibitionHeader}>
                <Image
                  source={exhibition.artist?.name === '杨西屏' 
                    ? require('../../public/images/artists/yangxiping_avatar.jpg')
                    : exhibition.artist?.name === '王正春'
                    ? require('../../public/images/artists/wangzhengchun_avatar.jpg')
                    : require('../../public/images/artists/yangxiping_avatar.jpg')
                  }
                  style={styles.curatorAvatar}
                />
                <View style={styles.exhibitionInfo}>
                  <Text style={styles.exhibitionTitle}>{exhibition.title}</Text>
                  <Text style={styles.exhibitionCurator}>策展人: {exhibition.curator}</Text>
                  <Text style={styles.exhibitionDescription}>{exhibition.description}</Text>
                </View>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artworkPreview}>
                {exhibition.artworks.slice(0, 4).map((artwork) => (
                  <View key={artwork.id} style={styles.previewItem}>
                    <Image
                      source={require('../../public/images/artworks/autumn_herding.jpg')}
                      style={styles.previewImage}
                    />
                    <Text style={styles.previewTitle} numberOfLines={1}>
                      {artwork.title}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              
              <View style={styles.exhibitionStats}>
                <Text style={styles.exhibitionStat}>{exhibition.artworks.length} 件作品</Text>
                <Text style={styles.exhibitionStat}>{exhibition.views} 次浏览</Text>
                <Text style={styles.exhibitionStat}>
                  {exhibition.artworks.reduce((sum, a) => sum + a.stats.likes, 0)} 点赞
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>策展分类</Text>
          <View style={styles.categoriesGrid}>
            {[
              { name: '传统山水', count: 4, color: '#8B4513' },
              { name: '当代艺术', count: 2, color: '#4169E1' },
              { name: '个人回顾', count: 2, color: '#10b981' },
              { name: '文化传承', count: 6, color: '#f59e0b' },
            ].map((category) => (
              <TouchableOpacity key={category.name} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} 件作品</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  featuredCard: {
    width: 280,
    height: 160,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  featuredImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.borderRadius.lg,
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.borderRadius.lg,
  },
  featuredContent: {
    padding: theme.spacing.md,
  },
  featuredTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: '#ffffff',
    marginBottom: theme.spacing.xs,
  },
  featuredSubtitle: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.xs,
  },
  featuredStats: {
    fontSize: theme.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  exhibitionCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  exhibitionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  curatorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
  },
  exhibitionInfo: {
    flex: 1,
    minHeight: 100,
    justifyContent: 'flex-start',
  },
  exhibitionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  exhibitionCurator: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  exhibitionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.sm,
    marginTop: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  artworkPreview: {
    marginBottom: theme.spacing.md,
  },
  previewItem: {
    marginRight: theme.spacing.md,
    width: 100,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  previewTitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    textAlign: 'center',
  },
  exhibitionStats: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  exhibitionStat: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: theme.spacing.sm,
  },
  categoryName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  categoryCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  curationList: {
    gap: theme.spacing.md,
  },
  curationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  curationCover: {
    height: 180,
    position: 'relative',
  },
  curationGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  curationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  curationInfo: {
    padding: theme.spacing.md,
  },
  curationTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  curationMeta: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  curationStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  curationStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  curationStatText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  curationViewBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.sm,
  },
  curationViewBtnText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
});
