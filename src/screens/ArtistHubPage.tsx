import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import { SearchIcon } from '../components/icons';

interface ArtistCardProps {
  artist: any;
  onPress: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onPress }) => {
  const { toggleFollow } = useAppStore();

  const getAvatarPath = (artistName: string) => {
    // 使用CDN URL替代本地路径
    if (artistName === '杨西屏') {
      return 'https://picsum.photos/120/120?random=6';
    } else if (artistName === '王正春') {
      return 'https://picsum.photos/120/120?random=7';
    }
    return artist.avatar;
  };

  return (
    <TouchableOpacity style={styles.artistCard} onPress={onPress}>
      <View style={styles.artistAvatarContainer}>
        <View style={styles.storyAvatar}>
          <Image
            source={{ uri: getAvatarPath(artist.name) }}
            style={styles.artistAvatarImage}
            resizeMode="cover"
          />
        </View>
      </View>
      <Text style={styles.artistName}>{artist.name}</Text>
      <Text style={styles.artistLocation}>{artist.location}</Text>
      <View style={styles.artistStats}>
        <View style={styles.artistStatGroup}>
          <Text style={styles.artistStatValue}>{artist.stats.artworks}</Text>
          <Text style={styles.artistStatLabel}>作品</Text>
        </View>
        <View style={styles.artistStatGroup}>
          <Text style={styles.artistStatValue}>
            {artist.stats.followers > 1000
              ? `${(artist.stats.followers / 1000).toFixed(1)}k`
              : artist.stats.followers}
          </Text>
          <Text style={styles.artistStatLabel}>关注者</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.followBtn,
          artist.isFollowing && styles.followBtnActive,
        ]}
        onPress={() => toggleFollow(artist.id)}
      >
        <Text
          style={[
            styles.followBtnText,
            artist.isFollowing && styles.followBtnTextActive,
          ]}
        >
          {artist.isFollowing ? '已关注' : '关注'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const ArtistHubPage: React.FC = () => {
  const navigation = useNavigation();
  const { artists } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const [sortBy, setSortBy] = useState('name'); // name, followers, artworks

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artist.bio && artist.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'followers':
        return (b.stats?.followers || 0) - (a.stats?.followers || 0);
      case 'artworks':
        return (b.stats?.artworks || 0) - (a.stats?.artworks || 0);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const renderArtistCard = ({ item }: { item: any }) => (
    <ArtistCard
      artist={item}
      onPress={() => (navigation as any).navigate('ArtistPage', { artistId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <Text style={styles.title}>艺术家中心</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchIcon size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索艺术家姓名或风格..."
              placeholderTextColor={theme.colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Pills */}
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

          {/* Artist Grid */}
          <FlatList
            data={filteredArtists}
            renderItem={renderArtistCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.artistGrid}
            columnWrapperStyle={styles.artistRow}
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
  page: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },
  filterPills: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
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
  artistGrid: {
    paddingBottom: theme.spacing.xl,
  },
  artistRow: {
    justifyContent: 'space-between',
  },
  artistCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  artistAvatarContainer: {
    marginBottom: theme.spacing.sm,
  },
  storyAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.gray100,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    overflow: 'hidden',
  },
  artistAvatarImage: {
    flex: 1,
    borderRadius: 38,
  },
  artistName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  artistLocation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  artistStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  artistStatGroup: {
    alignItems: 'center',
  },
  artistStatValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  artistStatLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  followBtn: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.xs,
  },
  followBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  followBtnText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  followBtnTextActive: {
    color: 'white',
  },
});
