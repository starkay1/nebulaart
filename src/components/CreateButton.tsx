import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import { PlusIcon, CloseIcon, ImageIcon, BoardIcon, CurationIcon } from './icons';
import { buttonAccessibility } from '../utils/accessibility';

const { width, height } = Dimensions.get('window');

interface CreateOptionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const CreateOption: React.FC<CreateOptionProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity 
    style={styles.createOption} 
    onPress={onPress}
    {...buttonAccessibility(label, `创建${label}`)}
  >
    <View style={styles.createOptionIcon}>
      <LinearGradient
        colors={[...theme.gradients.primary]}
        style={styles.createOptionIconGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {icon}
      </LinearGradient>
    </View>
    <Text style={styles.createOptionLabel}>{label}</Text>
  </TouchableOpacity>
);

export const CreateButton: React.FC = () => {
  const { isCreateMenuOpen, toggleCreateMenu } = useAppStore();
  const insets = useSafeAreaInsets();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isCreateMenuOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: height,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCreateMenuOpen]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    toggleCreateMenu();
  };

  const handleOptionPress = (option: string) => {
    console.log('Create option selected:', option);
    toggleCreateMenu();
    
    // Navigate to appropriate screen based on option
    // This would need navigation prop passed down or use navigation hook
    switch (option) {
      case '上传作品':
        // Navigate to artwork upload
        break;
      case '创建画板':
        // Navigate to board creation
        break;
      case '发起策展':
        // Navigate to curation creation
        break;
    }
  };

  return (
    <>
      {/* Floating Create Button */}
      <Animated.View 
        style={[
          styles.createBtn,
          { 
            transform: [{ scale: scaleAnim }],
            bottom: 80 + insets.bottom
          }
        ]}
      >
        <TouchableOpacity 
          onPress={handlePress}
          {...buttonAccessibility('创建按钮', '打开创建菜单')}
        >
          <LinearGradient
            colors={[...theme.gradients.primary]}
            style={styles.createBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <PlusIcon size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Create Menu Modal */}
      <Modal
        visible={isCreateMenuOpen}
        transparent
        animationType="none"
        onRequestClose={toggleCreateMenu}
      >
        <View style={styles.modalContainer}>
          {/* Overlay */}
          <Animated.View 
            style={[
              styles.overlay,
              { opacity: opacityAnim }
            ]}
          >
            <TouchableOpacity 
              style={StyleSheet.absoluteFillObject}
              onPress={toggleCreateMenu}
              activeOpacity={1}
            />
          </Animated.View>

          {/* Menu */}
          <Animated.View
            style={[
              styles.createMenu,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <BlurView intensity={20} style={[styles.menuBlur, { paddingBottom: Math.max(40, insets.bottom + 20) }]}>
              <View style={styles.createMenuContent}>
                {/* Header */}
                <View style={styles.createMenuHeader}>
                  <Text style={styles.createMenuTitle}>开始创建</Text>
                  <TouchableOpacity 
                    style={styles.closeBtn}
                    onPress={toggleCreateMenu}
                    {...buttonAccessibility('关闭', '关闭创建菜单')}
                  >
                    <CloseIcon size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Options */}
                <View style={styles.createOptions}>
                  <CreateOption
                    icon={<ImageIcon size={24} color="white" />}
                    label="上传作品"
                    onPress={() => handleOptionPress('上传作品')}
                  />
                  <CreateOption
                    icon={<BoardIcon size={24} color="white" />}
                    label="创建画板"
                    onPress={() => handleOptionPress('创建画板')}
                  />
                  <CreateOption
                    icon={<CurationIcon size={24} color="white" />}
                    label="发起策展"
                    onPress={() => handleOptionPress('发起策展')}
                  />
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  createBtn: {
    position: 'absolute',
    bottom: 80,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    zIndex: 1000,
  },
  createBtnGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.xl,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  createMenu: {
    borderTopLeftRadius: theme.borderRadius['2xl'],
    borderTopRightRadius: theme.borderRadius['2xl'],
    overflow: 'hidden',
  },
  menuBlur: {
    paddingBottom: 40, // Safe area bottom - will be overridden dynamically
  },
  createMenuContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: theme.spacing.lg,
  },
  createMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  createMenuTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  createOption: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    minWidth: 80,
  },
  createOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  createOptionIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createOptionLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
});
