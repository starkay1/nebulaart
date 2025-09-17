import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import { BackIcon, ShareIcon } from '../components/icons';

interface ArtistPageProps {
  route: {
    params: {
      artistId: string;
    };
  };
  navigation: any;
}

export const ArtistPage: React.FC<any> = ({ route, navigation }) => {
  const { artistId } = route.params;
  const { artists, artworks, selectedFilter, setSelectedFilter, toggleFollow } = useAppStore();
  const artist = artists.find(a => a.id === artistId);
  const filters = ['作品', '策展', '展览', '关于'];

  // 获取该艺术家的所有作品
  const artistArtworks = artworks.filter(artwork => artwork.artist.id === artistId);

  const renderArtwork = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.artworkCard}
      onPress={() => (navigation as any).navigate('ArtworkDetailPage', { artworkId: item.id })}
    >
      <View style={styles.artworkImage}>
        <Image 
          source={require('../../public/images/artworks/autumn_herding.jpg')}
          style={styles.artworkGradient}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.artworkGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>
      <View style={styles.artworkInfo}>
        <Text style={styles.artworkTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.artworkStats}>
          <Text style={styles.artworkStatText}>{item.stats.likes} 喜欢</Text>
          <Text style={styles.artworkStatText}>{item.stats.comments} 评论</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!artist) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.artistHeader}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.artistName}>艺术家详情</Text>
        </View>
        <View style={styles.content}>
          <Text>艺术家未找到</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Artist Header */}
        <View style={styles.artistHeader}>
          <View style={styles.coverImage}>
            <LinearGradient
              colors={[...theme.gradients.primary]}
              style={styles.coverGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <TouchableOpacity 
              style={styles.backBtn}
              onPress={() => navigation?.goBack()}
            >
              <BackIcon size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.artistInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={artist.name === '杨西屏' 
                  ? require('../../public/images/artists/yangxiping_avatar.jpg')
                  : artist.name === '王正春'
                  ? require('../../public/images/artists/wangzhengchun_avatar.jpg')
                  : require('../../public/images/artists/yangxiping_avatar.jpg')
                }
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.artistName}>{artist.name}</Text>
            <Text style={styles.artistLocation}>{artist.location}</Text>
            <View style={styles.artistStats}>
              <View style={styles.artistStat}>
                <Text style={styles.artistStatValue}>{artist.stats.artworks}</Text>
                <Text style={styles.artistStatLabel}>作品</Text>
              </View>
              <View style={styles.artistStat}>
                <Text style={styles.artistStatValue}>{artist.stats.curations}</Text>
                <Text style={styles.artistStatLabel}>策展</Text>
              </View>
              <View style={styles.artistStat}>
                <Text style={styles.artistStatValue}>
                  {artist.stats.followers > 1000
                    ? `${(artist.stats.followers / 1000).toFixed(1)}k`
                    : artist.stats.followers}
                </Text>
                <Text style={styles.artistStatLabel}>收藏</Text>
              </View>
            </View>
            <View style={styles.artistActions}>
              <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={() => toggleFollow(artist.id)}
              >
                <Text style={styles.primaryBtnText}>
                  {artist.isFollowing ? '已关注' : '关注'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>私信</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <ShareIcon size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.artistBio}>
            <Text style={styles.bioText}>{artist.bio}</Text>
          </View>
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

        {/* Content Grid */}
        <View style={styles.contentContainer}>
          <FlatList
            data={artistArtworks}
            renderItem={renderArtwork}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.artworkGrid}
            columnWrapperStyle={styles.artworkRow}
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
  content: {
    flex: 1,
  },
  artistHeader: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  coverImage: {
    height: 200,
    position: 'relative',
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backBtn: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistInfo: {
    padding: theme.spacing.lg,
    marginTop: -60,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    padding: 4,
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  avatar: {
    flex: 1,
    borderRadius: theme.borderRadius.full,
  },
  artistName: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  artistLocation: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  artistStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing['2xl'],
    marginBottom: theme.spacing.lg,
  },
  artistStat: {
    alignItems: 'center',
  },
  artistStatValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  artistStatLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  artistActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  primaryBtn: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
  },
  primaryBtnText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: 'white',
  },
  secondaryBtn: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray100,
  },
  secondaryBtnText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistBio: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  bioText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.base,
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
  contentContainer: {
    padding: theme.spacing.sm,
  },
  artworkGrid: {
    paddingBottom: theme.spacing.xl,
  },
  artworkRow: {
    justifyContent: 'space-between',
  },
  artworkCard: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  artworkImage: {
    height: 150,
    position: 'relative',
  },
  artworkGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  artworkInfo: {
    padding: theme.spacing.md,
  },
  artworkTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  artworkStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  artworkStatText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
});
