import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import { BackIcon, BookmarkIcon, ShareIcon } from '../components/icons';

interface CurationDetailPageProps {
  navigation?: any;
  route?: any;
}

export const CurationDetailPage: React.FC<CurationDetailPageProps> = ({ navigation, route }) => {
  const { curations, artworks, artists } = useAppStore();
  const [activeChapter, setActiveChapter] = useState(0);
  const { curationId } = route?.params || { curationId: 'curation1' };
  
  // Get real curation data
  const curation = curations.find(c => c.id === curationId) || curations[0];
  
  // Get real exhibition data based on curation
  const exhibitions = [
    {
      id: 'exhibition1',
      title: '杨西屏艺术回顾展',
      curator: '杨西屏',
      artist: artists.find(a => a.id === 'artist1'),
      artworks: artworks.filter(a => a.artist.id === 'artist1'),
    },
    {
      id: 'exhibition2', 
      title: '王正春当代艺术展',
      curator: '王正春',
      artist: artists.find(a => a.id === 'artist2'),
      artworks: artworks.filter(a => a.artist.id === 'artist2'),
    },
  ];
  
  const exhibition = exhibitions.find(e => e.id === curationId) || exhibitions[0];

  const chapters = [
    { id: 0, title: '第一章 · 传承' },
    { id: 1, title: '第二章 · 解构' },
    { id: 2, title: '第三章 · 重构' },
  ];

  // Distribute real artworks across chapters
  const exhibitionArtworks = exhibition.artworks.map((artwork, index) => ({
    ...artwork,
    chapter: Math.floor(index / Math.ceil(exhibition.artworks.length / 3)),
  }));

  const filteredArtworks = exhibitionArtworks.filter(artwork => artwork.chapter === activeChapter);

  const renderArtwork = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.artworkCard}
      onPress={() => navigation?.navigate('ArtworkDetailPage', { artworkId: item.id })}
    >
      <View style={styles.artworkImage}>
        <Image
          source={{ uri: item.image }}
          style={styles.artworkGradient}
          resizeMode="cover"
        />
        <View style={styles.artworkOverlay}>
          <View style={styles.artworkActions}>
            <TouchableOpacity style={styles.artworkActionBtn}>
              <BookmarkIcon size={16} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.artworkActionBtn}>
              <ShareIcon size={16} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sectionTag}>
          <Text style={styles.sectionTagText}>{chapters[item.chapter].title}</Text>
        </View>
      </View>
      <View style={styles.artworkInfo}>
        <Text style={styles.artworkTitle}>{item.title}</Text>
        <View style={styles.artworkArtist}>
          <Image
            source={{ uri: item.artist.avatar }}
            style={styles.artworkArtistAvatar}
            resizeMode="cover"
          />
          <Text style={styles.artworkArtistName}>{item.artist.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleListenPress = () => {
    Alert.alert(
      `🔊 正在播放策展人${exhibition.curator}的声音`,
      `"${exhibition.curator === '杨西屏' ? '传统山水画的精神内核在于天人合一，每一笔都承载着对自然的敬畏与理解。' : '艺术创作是心灵与自然的对话，通过笔墨表达内心的情感与对美的追求。'}"`
    );
  };

  if (!curation) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.cover}>
          <LinearGradient
            colors={curation.cover || ['#667eea', '#764ba2']}
            style={styles.coverGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.coverOverlay} />
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation?.goBack()}
          >
            <BackIcon size={20} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.curationTitle}>{exhibition.title}</Text>
            <Text style={styles.curationMeta}>
              策展人：{exhibition.curator} | 2024年春
            </Text>
            <View style={styles.inkDrop} />
          </View>
        </View>

        {/* Statement */}
        <View style={styles.statement}>
          <Text style={styles.statementText}>
            {exhibition.curator === '杨西屏' ? (
              <>本次回顾展汇集了{exhibition.curator}多年来的精品力作，展现传统中国山水画的深厚底蕴与</>
            ) : (
              <>{exhibition.curator}的当代艺术作品展现了传统文化与现代表达的完美融合，通过</>
            )}
            <Text style={styles.highlightText}>笔墨精神</Text>
            {exhibition.curator === '杨西屏' ? (
              <>现代表达的完美结合。每一幅作品都承载着对自然的敬畏与对传统文化的传承。</>
            ) : (
              <>诠释了当代艺术家对传统文化的理解与创新，展现了艺术的时代性与永恒性。</>
            )}
          </Text>
        </View>

        {/* Chapters */}
        <View style={styles.chaptersContainer}>
          <Text style={styles.chaptersTitle}>策展章节</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chapterTimeline}>
              {chapters.map((chapter) => (
                <TouchableOpacity
                  key={chapter.id}
                  style={[
                    styles.chapterItem,
                    activeChapter === chapter.id && styles.chapterItemActive,
                  ]}
                  onPress={() => setActiveChapter(chapter.id)}
                >
                  <Text
                    style={[
                      styles.chapterItemText,
                      activeChapter === chapter.id && styles.chapterItemTextActive,
                    ]}
                  >
                    {chapter.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{chapters[activeChapter].title}</Text>
          <FlatList
            data={filteredArtworks}
            renderItem={renderArtwork}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionGallery}
          />
        </View>

        {/* Listen Button */}
        <TouchableOpacity style={styles.listenBtn} onPress={handleListenPress}>
          <View style={styles.listenIcon} />
          <Text style={styles.listenBtnText}>聆听策展人{exhibition.curator}的创作心声</Text>
        </TouchableOpacity>

        {/* Signature */}
        <View style={styles.signature}>
          <Text style={styles.signatureText}>—— 策展人 {exhibition.curator}，2024年春于成都</Text>
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
  cover: {
    height: 320,
    position: 'relative',
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
  },
  curationTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: 'white',
    marginBottom: theme.spacing.xs,
    letterSpacing: theme.letterSpacing.tight,
  },
  curationMeta: {
    fontSize: theme.fontSize.lg,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
  },
  inkDrop: {
    position: 'absolute',
    bottom: 8,
    right: theme.spacing.lg,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statement: {
    padding: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    maxWidth: 700,
    alignSelf: 'center',
  },
  statementText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.loose * theme.fontSize.base,
    textAlign: 'center',
  },
  highlightText: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  chaptersContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  chaptersTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  chapterTimeline: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  chapterItem: {
    minWidth: 120,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  chapterItemActive: {
    backgroundColor: theme.colors.primary,
    borderColor: 'transparent',
  },
  chapterItemText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  chapterItemTextActive: {
    color: 'white',
  },
  section: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingLeft: 12,
    position: 'relative',
  },
  sectionGallery: {
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  artworkCard: {
    width: 180,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  artworkImage: {
    height: 180,
    position: 'relative',
  },
  artworkGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  artworkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: 0,
  },
  artworkActions: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  artworkActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  sectionTagText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  artworkInfo: {
    padding: theme.spacing.md,
  },
  artworkTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  artworkArtist: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  artworkArtistAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.gray200,
  },
  artworkArtistName: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  listenIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
  },
  listenBtnText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  signature: {
    padding: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  signatureText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});
