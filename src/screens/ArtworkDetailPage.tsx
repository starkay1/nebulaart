import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Share from 'react-native-share'; // Disabled for web build
import { useAppStore, Comment } from '../store/appStore';
import { theme } from '../theme/theme';
import { HeartIcon, CommentIcon, BookmarkIcon, ShareIcon, BackIcon } from '../components/icons';

const { width, height } = Dimensions.get('window');

interface ArtworkDetailPageProps {
  route?: {
    params: {
      artworkId: string;
    };
  };
  navigation?: any;
}

const ArtworkDetailPage: React.FC<ArtworkDetailPageProps> = ({
  route,
  navigation,
}) => {
  const artworkId = route?.params?.artworkId || 'artwork1'; // fallback for testing
  const insets = useSafeAreaInsets();
  const { 
    artworks, 
    comments, 
    currentUser, 
    toggleLike, 
    toggleBookmark, 
    addComment, 
    toggleCommentLike 
  } = useAppStore();
  
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  const artwork = artworks.find(a => a.id === artworkId);
  const artworkComments = comments[artworkId] || [];
  
  if (!artwork) {
    return (
      <View style={styles.container}>
        <Text>作品未找到</Text>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      if (!artwork) {
        Alert.alert('错误', '作品信息不完整，无法分享');
        return;
      }

      const shareData = {
        title: `${artwork.title} - ${artwork.artist.name}`,
        text: `来看看这个精彩的艺术作品：${artwork.title}，作者：${artwork.artist.name}`,
        url: `https://nebulaart.pages.dev/artwork/${artwork.id}`,
      };

      if (navigator.share) {
        try {
          // 使用原生分享API
          await navigator.share(shareData);
          // 原生分享成功，不需要额外提示
        } catch (shareError: any) {
          // 用户取消分享或分享失败，降级到剪贴板
          if (shareError.name !== 'AbortError') {
            await fallbackToClipboard(shareData);
          }
        }
      } else {
        // 不支持原生分享，直接使用剪贴板
        await fallbackToClipboard(shareData);
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('分享失败', '请稍后重试或手动复制链接');
    }
  };

  const fallbackToClipboard = async (shareData: any) => {
    try {
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        Alert.alert('已复制', '作品链接已复制到剪贴板');
      } else {
        // 最后的降级方案：显示文本让用户手动复制
        Alert.alert('分享内容', shareText, [
          { text: '取消', style: 'cancel' },
          { text: '好的', style: 'default' }
        ]);
      }
    } catch (clipboardError) {
      console.error('Clipboard error:', clipboardError);
      Alert.alert('复制失败', '请手动复制分享内容');
    }
  };

  const handleAddComment = async () => {
    try {
      if (!currentUser) {
        Alert.alert('提示', '请先登录后再评论');
        return;
      }
      
      if (!commentText.trim()) {
        Alert.alert('提示', '请输入评论内容');
        return;
      }

      if (commentText.trim().length > 500) {
        Alert.alert('提示', '评论内容不能超过500个字符');
        return;
      }

      // 检查是否包含敏感内容（简单示例）
      const sensitiveWords = ['spam', '垃圾', '广告'];
      const hasSensitiveContent = sensitiveWords.some(word => 
        commentText.toLowerCase().includes(word)
      );

      if (hasSensitiveContent) {
        Alert.alert('提示', '评论内容包含不当信息，请修改后重试');
        return;
      }

      // 添加评论
      addComment(artworkId, commentText.trim());
      setCommentText('');
      Alert.alert('成功', '评论发表成功');
      
    } catch (error) {
      console.error('Comment submission error:', error);
      Alert.alert('发表失败', '评论发表失败，请稍后重试');
    }
  };

  const handleReplyComment = (commentId: string, userName: string) => {
    Alert.alert(
      '回复评论',
      `回复 @${userName}`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '回复', 
          onPress: () => {
            setCommentText(`@${userName} `);
            Alert.alert('提示', '评论回复功能开发中');
          }
        }
      ]
    );
  };

  const handleMentionUser = (userName: string) => {
    Alert.alert(
      '提及用户',
      `@${userName}`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '查看资料', 
          onPress: () => Alert.alert('提示', '用户资料页面开发中')
        }
      ]
    );
  };

  const handleCommentLike = (commentId: string) => {
    if (!currentUser) {
      Alert.alert('提示', '请先登录');
      return;
    }
    toggleCommentLike(artworkId, commentId);
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image
        source={{ 
          uri: item.userAvatar,
        }}
        style={styles.commentAvatar}
        resizeMode={"cover"}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>{item.userName}</Text>
          <Text style={styles.commentTime}>{item.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <TouchableOpacity
          style={styles.commentLikeButton}
          onPress={() => handleCommentLike(item.id)}
        >
          <HeartIcon 
            size={16} 
            color={item.isLiked ? theme.colors.primary : theme.colors.textLight}
            filled={item.isLiked}
          />
          <Text style={styles.commentLikeText}>{item.likes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>作品详情</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: artwork.image,
              priority: FastImage.priority.high,
            }} 
            style={styles.image} 
            resizeMode={"cover"}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Artist Info */}
          <View style={styles.artistSection}>
            <View style={styles.artistInfo}>
              <Image 
                source={{ 
                  uri: artwork.artist.avatar,
                }} 
                style={styles.artistAvatar} 
                resizeMode={"cover"}
              />
              <View style={styles.artistDetails}>
                <Text style={styles.artistName}>{artwork.artist.name}</Text>
                <Text style={styles.artworkTitle}>{artwork.title}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleLike(artwork.id)}
            >
              <HeartIcon
                size={24}
                color={artwork.isLiked ? theme.colors.primary : theme.colors.textSecondary}
                filled={artwork.isLiked}
              />
              <Text style={[styles.actionText, artwork.isLiked && styles.actionTextActive]}>
                {artwork.stats.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowComments(!showComments)}
            >
              <CommentIcon size={24} color={theme.colors.textSecondary} />
              <Text style={styles.actionText}>{artworkComments.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleBookmark(artwork.id)}
            >
              <BookmarkIcon
                size={24}
                color={artwork.isBookmarked ? theme.colors.primary : theme.colors.textSecondary}
                filled={artwork.isBookmarked}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <ShareIcon size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          {showComments && (
            <View style={styles.commentsSection}>
              <Text style={styles.sectionTitle}>评论 ({artworkComments.length})</Text>
              
              {/* Comment Input */}
              {currentUser && (
                <View style={styles.commentInput}>
                  <TextInput
                    style={styles.commentTextInput}
                    placeholder="写下你的想法..."
                    placeholderTextColor={theme.colors.textLight}
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    style={styles.commentSubmitButton}
                    onPress={handleAddComment}
                  >
                    <LinearGradient
                      colors={[...theme.gradients.primary]}
                      style={styles.commentSubmitGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.commentSubmitText}>发布</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Comments List */}
              <FlatList
                data={artworkComments}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ListEmptyComponent={
                  <Text style={styles.noCommentsText}>暂无评论，快来发表第一条评论吧！</Text>
                }
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: theme.spacing.lg,
  },
  artistSection: {
    marginBottom: theme.spacing.lg,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.md,
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  artworkTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
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
  actionTextActive: {
    color: theme.colors.primary,
  },
  commentsSection: {
    marginTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  commentSubmitButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  commentSubmitGradient: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  commentSubmitText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: 'white',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.md,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  commentUserName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginRight: theme.spacing.md,
  },
  commentTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  commentText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.relaxed,
    marginBottom: theme.spacing.sm,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  commentLikeText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  noCommentsText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
});

export { ArtworkDetailPage };
