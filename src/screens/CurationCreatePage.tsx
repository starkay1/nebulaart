import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { useAppStore, Artwork } from '../store/appStore';
import { BackIcon, CheckIcon } from '../components/icons';

export const CurationCreatePage: React.FC = () => {
  const navigation = useNavigation();
  const { artworks, currentUser, createCuration } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);

  const handleSelectArtwork = (artworkId: string) => {
    setSelectedArtworks(prev => {
      if (prev.includes(artworkId)) {
        return prev.filter(id => id !== artworkId);
      } else {
        return [...prev, artworkId];
      }
    });
  };

  const handleCreateCuration = () => {
    if (!title.trim()) {
      Alert.alert('错误', '请输入策展标题');
      return;
    }

    if (!description.trim()) {
      Alert.alert('错误', '请输入策展描述');
      return;
    }

    if (selectedArtworks.length === 0) {
      Alert.alert('错误', '请至少选择一件作品');
      return;
    }

    if (!currentUser) {
      Alert.alert('错误', '请先登录');
      return;
    }

    const selectedArtworkObjects = artworks.filter(artwork => 
      selectedArtworks.includes(artwork.id)
    );

    const curation = {
      title,
      description,
      curator: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar || './images/artists/yangxiping_avatar.jpg'
      },
      artworks: selectedArtworks,
      coverImage: selectedArtworkObjects[0]?.image || './images/curations/default.jpg',
      cover: selectedArtworkObjects.slice(0, 4).map(artwork => artwork.image),
      createdAt: new Date().toISOString(),
    };

    createCuration(curation);
    Alert.alert('成功', '策展创建成功', [
      { text: '确定', onPress: () => navigation.goBack() }
    ]);
  };

  const renderArtworkItem = ({ item }: { item: Artwork }) => {
    const isSelected = selectedArtworks.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.artworkItem}
        onPress={() => handleSelectArtwork(item.id)}
      >
        <View style={styles.artworkImageContainer}>
          <Image
            source={{ 
              uri: item.image,
            }}
            style={styles.artworkImage}
            resizeMode={"cover"}
          />
          {isSelected && (
            <View style={styles.selectedOverlay}>
              <LinearGradient
                colors={[...theme.gradients.primary]}
                style={styles.selectedIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <CheckIcon size={16} color="white" />
              </LinearGradient>
            </View>
          )}
        </View>
        <View style={styles.artworkInfo}>
          <Text style={styles.artworkTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.artworkArtist} numberOfLines={1}>
            {item.artist.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>创建策展</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCuration}
        >
          <LinearGradient
            colors={[...theme.gradients.primary]}
            style={styles.createButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.createButtonText}>创建</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>策展标题</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入策展标题"
              placeholderTextColor={theme.colors.textLight}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>策展描述</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="请描述这次策展的主题和理念"
              placeholderTextColor={theme.colors.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.artworkSection}>
          <Text style={styles.sectionTitle}>
            选择作品 ({selectedArtworks.length})
          </Text>
          <Text style={styles.sectionSubtitle}>
            点击作品进行选择，至少选择一件作品
          </Text>
          
          <FlatList
            data={artworks}
            renderItem={renderArtworkItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.artworkList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  createButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  createButtonGradient: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  createButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: 'white',
  },
  content: {
    flex: 1,
  },
  formSection: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sectionSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 100,
    paddingTop: theme.spacing.md,
  },
  artworkSection: {
    padding: theme.spacing.lg,
  },
  artworkList: {
    gap: theme.spacing.sm,
  },
  artworkItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  artworkImageContainer: {
    position: 'relative',
    height: 120,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  selectedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkInfo: {
    padding: theme.spacing.md,
  },
  artworkTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.lineHeight.tight,
  },
  artworkArtist: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
});
