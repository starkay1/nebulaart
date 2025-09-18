import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { useAppStore, Board } from '../store/appStore';
import { PlusIcon, CloseIcon } from '../components/icons';

export const BoardPage: React.FC = () => {
  const { boards, currentUser, createBoard, artworks } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardName, setBoardName] = useState('');

  const handleCreateBoard = () => {
    if (!boardName.trim()) {
      Alert.alert('错误', '请输入画板名称');
      return;
    }

    createBoard(boardName.trim());
    setBoardName('');
    setShowCreateModal(false);
    Alert.alert('成功', '画板创建成功');
  };

  const getBoardCoverImage = (board: Board): string => {
    if (board.artworkIds.length === 0) {
      return '';
    }
    const firstArtwork = artworks.find(artwork => artwork.id === board.artworkIds[0]);
    return firstArtwork?.image || '';
  };

  const renderBoardItem = ({ item }: { item: Board }) => {
    const coverImage = getBoardCoverImage(item);

    return (
      <TouchableOpacity style={styles.boardCard}>
        <View style={styles.boardImageContainer}>
          {coverImage ? (
            <Image
              source={{ 
                uri: coverImage,
              }}
              style={styles.boardImage}
              resizeMode={"cover"}
            />
          ) : (
            <LinearGradient
              colors={['#f3f4f6', '#e5e7eb']}
              style={styles.boardImagePlaceholder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.placeholderText}>暂无作品</Text>
            </LinearGradient>
          )}
        </View>
        <View style={styles.boardInfo}>
          <Text style={styles.boardName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.boardCount}>
            {item.artworkIds.length} 件作品
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCreateButton = () => (
    <TouchableOpacity
      style={styles.createCard}
      onPress={() => setShowCreateModal(true)}
    >
      <LinearGradient
        colors={[...theme.gradients.primary]}
        style={styles.createCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <PlusIcon size={32} color="white" />
        <Text style={styles.createCardText}>创建画板</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>创建画板</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCreateModal(false)}
            >
              <CloseIcon size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>画板名称</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入画板名称"
              placeholderTextColor={theme.colors.textLight}
              value={boardName}
              onChangeText={setBoardName}
              maxLength={30}
              autoFocus
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleCreateBoard}
            >
              <LinearGradient
                colors={[...theme.gradients.primary]}
                style={styles.confirmButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.confirmButtonText}>创建</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>请先登录</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userBoards = boards.filter(board => board.userId === currentUser.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的画板</Text>
        <Text style={styles.subtitle}>
          {userBoards.length} 个画板
        </Text>
      </View>

      <FlatList
        data={[{ id: 'create', type: 'create' }, ...userBoards]}
        renderItem={({ item }) => {
          if ('type' in item && item.type === 'create') {
            return renderCreateButton();
          }
          return renderBoardItem({ item: item as Board });
        }}
        keyExtractor={(item) => 'type' in item ? item.id : item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {renderCreateModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  listContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  boardCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  createCard: {
    flex: 1,
    height: 160,
    margin: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  createCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  createCardText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: 'white',
  },
  boardImageContainer: {
    height: 120,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  boardImage: {
    width: '100%',
    height: '100%',
  },
  boardImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
  boardInfo: {
    padding: theme.spacing.md,
  },
  boardName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  boardCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    width: '85%',
    maxWidth: 400,
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    paddingTop: 0,
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: 'white',
  },
});
