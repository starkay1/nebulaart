import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme/theme';
import { useAppStore, UserArtwork } from '../../store/appStore';
import { pickImage, SelectedImage, generateImageId } from '../../utils/imagePicker';
import CloseIcon from '../icons/CloseIcon';

interface UploadWorkModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function UploadWorkModal({ visible, onClose, onSuccess }: UploadWorkModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { addArtwork } = useAppStore();

  const openImagePicker = () => {
    // 模拟图片选择，实际项目中需要安装 react-native-image-picker
    Alert.alert(
      '选择图片',
      '请选择图片来源',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '相册', 
          onPress: () => {
            // 模拟选择图片
            const mockImageUri = 'https://picsum.photos/400/600?random=' + Date.now();
            setSelectedImage(mockImageUri);
          }
        },
      ]
    );
  };

  const handlePublish = async () => {
    if (!selectedImage || !title.trim()) {
      Alert.alert('提示', '请选择图片并输入作品标题');
      return;
    }

    setIsUploading(true);
    
    try {
      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const artwork: UserArtwork = {
        id: generateImageId(),
        title,
        description,
        image: selectedImage,
        artistId: 'user1', // Current user ID
        createdAt: new Date().toISOString(),
        stats: {
          likes: 0,
          comments: 0,
        },
        isLiked: false,
        isBookmarked: false,
      };

      addArtwork(artwork);
      
      // 重置表单
      setSelectedImage(null);
      setTitle('');
      setDescription('');
      
      onSuccess();
      onClose();
      
      Alert.alert('成功', '作品发布成功！');
    } catch (error) {
      Alert.alert('错误', '发布失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          onPress={handleClose}
          activeOpacity={1}
        />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>上传作品</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <CloseIcon size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 图片选择区域 */}
            <TouchableOpacity style={styles.imageSelector} onPress={openImagePicker}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>点击选择图片</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* 标题输入 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>作品标题</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="给你的作品起个名字"
                placeholderTextColor={theme.colors.textLight}
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>

            {/* 描述输入 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>作品描述</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="描述你的创作灵感和理念..."
                placeholderTextColor={theme.colors.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={200}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.publishButton, 
                (!selectedImage || !title.trim() || isUploading) && styles.publishButtonDisabled
              ]} 
              onPress={handlePublish}
              disabled={!selectedImage || !title.trim() || isUploading}
            >
              <Text style={styles.publishButtonText}>
                {isUploading ? '发布中...' : '发布'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageSelector: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: '#ffffff',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: '#ffffff',
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  publishButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: theme.colors.textLight,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
