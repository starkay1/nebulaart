import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { theme } from '../../theme/theme';
import { useAppStore } from '../../store/appStore';
import { CloseIcon } from '../icons';

const { width, height } = Dimensions.get('window');

interface BecomeArtistModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BecomeArtistModal({ visible, onClose }: BecomeArtistModalProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState('');
  const { becomeArtist } = useAppStore();

  const handleSubmit = () => {
    if (name.trim() && bio.trim()) {
      becomeArtist({
        name: name.trim(),
        bio: bio.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      });
      onClose();
      setName('');
      setBio('');
      setTags('');
    }
  };

  const isSubmitEnabled = name.trim().length > 0 && bio.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>成为艺术家</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <CloseIcon size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="请输入您的真实姓名"
                  placeholderTextColor={theme.colors.textLight}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Bio Input */}
              <View style={styles.inputGroup}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="简短介绍你的艺术风格（如：探索东方水墨与数字媒介的融合）"
                  placeholderTextColor={theme.colors.textLight}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Tags Input */}
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="选择风格标签（用逗号分隔，如：水墨,新媒体,雕塑）"
                  placeholderTextColor={theme.colors.textLight}
                  value={tags}
                  onChangeText={setTags}
                />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  !isSubmitEnabled && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!isSubmitEnabled}
              >
                <Text style={[
                  styles.submitButtonText,
                  !isSubmitEnabled && styles.submitButtonTextDisabled
                ]}>
                  提交认证
                </Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing.lg,
    ...theme.shadows.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  input: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    height: 100,
    paddingTop: theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  submitButton: {
    flex: 1,
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.gray300,
  },
  submitButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: 'white',
  },
  submitButtonTextDisabled: {
    color: theme.colors.textLight,
  },
});
