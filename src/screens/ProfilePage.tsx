import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import { Switch } from 'react-native';
import BecomeArtistModal from '../components/modals/BecomeArtistModal';

export const ProfilePage: React.FC = () => {
  const { currentUser, selectedFilter, setSelectedFilter, isDarkMode, toggleDarkMode, login, register, logout } = useAppStore();
  const [showBecomeArtistModal, setShowBecomeArtistModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showArtistRegisterModal, setShowArtistRegisterModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [artistRegisterForm, setArtistRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    artStyle: '', 
    bio: '', 
    portfolio: '' 
  });
  const [userArtworks, setUserArtworks] = useState<any[]>([]);
  const filters = ['作品', '收藏', '画板'];

  useEffect(() => {
    const loadUserArtworks = async () => {
      try {
        const response = await fetch(`https://nebulaart-api.onrender.com/api/users/${currentUser?.id}/artworks`);
        const artworks = await response.json();
        setUserArtworks(artworks);
      } catch (error) {
        console.error('Failed to load user artworks:', error);
        // Fallback data
        setUserArtworks([
          {
            id: 'my1',
            title: '我的作品 1',
            image: 'https://picsum.photos/400/600?random=2001',
            stats: { likes: 120, comments: 15 },
          },
          {
            id: 'my2',
            title: '我的作品 2',
            image: 'https://picsum.photos/400/600?random=2002',
            stats: { likes: 89, comments: 8 },
          },
          {
            id: 'my3',
            title: '我的作品 3',
            image: 'https://picsum.photos/400/600?random=2003',
            stats: { likes: 156, comments: 23 },
          },
          {
            id: 'my4',
            title: '我的作品 4',
            image: 'https://picsum.photos/400/600?random=2004',
            stats: { likes: 203, comments: 31 },
          },
        ]);
      }
    };

    if (currentUser) {
      loadUserArtworks();
    }
  }, [currentUser]);

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('错误', '请填写完整的登录信息');
      return;
    }
    
    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        Alert.alert('登录成功', '欢迎回到星云艺术');
        setShowLoginModal(false);
        setLoginForm({ email: '', password: '' });
      } else {
        Alert.alert('登录失败', '邮箱或密码错误，请重试');
      }
    } catch (error) {
      Alert.alert('登录失败', '网络错误，请稍后重试');
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      Alert.alert('错误', '请填写完整的注册信息');
      return;
    }
    
    try {
      const success = await register(registerForm);
      if (success) {
        Alert.alert('注册成功', '欢迎加入星云艺术');
        setShowRegisterModal(false);
        setRegisterForm({ name: '', email: '', password: '' });
      } else {
        Alert.alert('注册失败', '该邮箱已被注册，请使用其他邮箱');
      }
    } catch (error) {
      Alert.alert('注册失败', '网络错误，请稍后重试');
    }
  };

  const handleArtistRegister = () => {
    if (!artistRegisterForm.name || !artistRegisterForm.email || !artistRegisterForm.password || !artistRegisterForm.artStyle || !artistRegisterForm.bio) {
      Alert.alert('错误', '请填写完整的艺术家注册信息');
      return;
    }
    Alert.alert('申请成功', '您的艺术家申请已提交，我们将在3个工作日内审核');
    setShowArtistRegisterModal(false);
    setArtistRegisterForm({ name: '', email: '', password: '', artStyle: '', bio: '', portfolio: '' });
  };

  const renderArtwork = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.artworkCard}>
      <Image 
        source={{ uri: item.image }}
        style={styles.artworkImage}
        resizeMode="cover"
      />
      <View style={styles.artworkInfo}>
        <Text style={styles.artworkTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.artworkStats}>
          <Text style={styles.artworkStatText}>128 喜欢</Text>
          <Text style={styles.artworkStatText}>32 评论</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 如果用户未登录，显示登录界面
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>欢迎来到星云艺术</Text>
          <Text style={styles.loginSubtitle}>登录或注册以开始您的艺术之旅</Text>
          
          <View style={styles.authButtons}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => setShowLoginModal(true)}
            >
              <Text style={styles.loginButtonText}>登录</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => setShowRegisterModal(true)}
            >
              <Text style={styles.registerButtonText}>注册</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.becomeArtistButton}
            onPress={() => setShowArtistRegisterModal(true)}
          >
            <Text style={styles.becomeArtistButtonText}>申请成为艺术家</Text>
          </TouchableOpacity>
        </View>
        
        {/* 登录模态框等保持不变 */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.coverImage}>
            <LinearGradient
              colors={[...theme.gradients.primary]}
              style={styles.coverGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[...theme.gradients.primary]}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </View>
            <Text style={styles.userName}>{currentUser.name}</Text>
            {currentUser.bio && (
              <Text style={styles.userBio}>{currentUser.bio}</Text>
            )}
            <View style={styles.userStats}>
              <View style={styles.userStat}>
                <Text style={styles.userStatValue}>{currentUser.artworks}</Text>
                <Text style={styles.userStatLabel}>作品</Text>
              </View>
              <View style={styles.userStat}>
                <Text style={styles.userStatValue}>{currentUser.followers}</Text>
                <Text style={styles.userStatLabel}>关注者</Text>
              </View>
              <View style={styles.userStat}>
                <Text style={styles.userStatValue}>{currentUser.following}</Text>
                <Text style={styles.userStatLabel}>关注</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              {currentUser.isArtist ? (
                <>
                  <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnText}>编辑资料</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryBtn}>
                    <Text style={styles.secondaryBtnText}>上传作品</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryBtn}>
                    <Text style={styles.secondaryBtnText}>创建画板</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.registerButton}
                    onPress={() => setShowRegisterModal(true)}
                    accessible={true}
                    accessibilityLabel="注册账户"
                  >
                    <Text style={styles.registerButtonText}>注册</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.becomeArtistButton}
                    onPress={() => setShowArtistRegisterModal(true)}
                    accessible={true}
                    accessibilityLabel="申请成为艺术家"
                  >
                    <Text style={styles.becomeArtistButtonText}>成为艺术家</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>深色模式</Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#e5e7eb', true: theme.colors.primary }}
                thumbColor={isDarkMode ? '#ffffff' : '#f3f4f6'}
                accessible={true}
                accessibilityLabel={isDarkMode ? '关闭深色模式' : '开启深色模式'}
              />
            </View>
            
            {currentUser && (
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={() => {
                  Alert.alert(
                    '退出登录',
                    '确定要退出登录吗？',
                    [
                      { text: '取消', style: 'cancel' },
                      { 
                        text: '退出', 
                        style: 'destructive',
                        onPress: () => {
                          logout();
                          Alert.alert('已退出', '您已成功退出登录');
                        }
                      }
                    ]
                  );
                }}
                accessible={true}
                accessibilityLabel="退出登录"
              >
                <Text style={styles.logoutButtonText}>退出登录</Text>
              </TouchableOpacity>
            )}
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
            data={userArtworks}
            renderItem={renderArtwork}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.artworkGrid}
            columnWrapperStyle={styles.artworkRow}
          />
        </View>
      </ScrollView>
      
      <BecomeArtistModal
        visible={showBecomeArtistModal}
        onClose={() => setShowBecomeArtistModal(false)}
      />

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>登录</Text>
            <TextInput
              style={styles.input}
              placeholder="邮箱"
              value={loginForm.email}
              onChangeText={(text) => setLoginForm({...loginForm, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="密码"
              value={loginForm.password}
              onChangeText={(text) => setLoginForm({...loginForm, password: text})}
              secureTextEntry
            />
            <TouchableOpacity onPress={() => Alert.alert('忘记密码', '请联系客服重置密码')}>
              <Text style={styles.forgotPassword}>忘记密码？</Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLoginModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={handleLogin}
              >
                <Text style={styles.modalButtonText}>登录</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Register Modal */}
      <Modal
        visible={showRegisterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRegisterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>注册</Text>
            <TextInput
              style={styles.input}
              placeholder="姓名"
              value={registerForm.name}
              onChangeText={(text) => setRegisterForm({...registerForm, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="邮箱"
              value={registerForm.email}
              onChangeText={(text) => setRegisterForm({...registerForm, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="密码"
              value={registerForm.password}
              onChangeText={(text) => setRegisterForm({...registerForm, password: text})}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRegisterModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={handleRegister}
              >
                <Text style={styles.modalButtonText}>注册</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Artist Register Modal */}
      <Modal
        visible={showArtistRegisterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowArtistRegisterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>申请成为艺术家</Text>
            <TextInput
              style={styles.input}
              placeholder="姓名"
              value={artistRegisterForm.name}
              onChangeText={(text) => setArtistRegisterForm({...artistRegisterForm, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="邮箱"
              value={artistRegisterForm.email}
              onChangeText={(text) => setArtistRegisterForm({...artistRegisterForm, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="密码"
              value={artistRegisterForm.password}
              onChangeText={(text) => setArtistRegisterForm({...artistRegisterForm, password: text})}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="艺术风格（如：水墨画、油画、雕塑等）"
              value={artistRegisterForm.artStyle}
              onChangeText={(text) => setArtistRegisterForm({...artistRegisterForm, artStyle: text})}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="个人简介"
              value={artistRegisterForm.bio}
              onChangeText={(text) => setArtistRegisterForm({...artistRegisterForm, bio: text})}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={styles.input}
              placeholder="作品集链接（可选）"
              value={artistRegisterForm.portfolio}
              onChangeText={(text) => setArtistRegisterForm({...artistRegisterForm, portfolio: text})}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowArtistRegisterModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={handleArtistRegister}
              >
                <Text style={styles.modalButtonText}>提交申请</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  profileHeader: {
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
  profileInfo: {
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
    borderRadius: 56,
  },
  userName: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userBio: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing['2xl'],
    marginBottom: theme.spacing.lg,
  },
  userStat: {
    alignItems: 'center',
  },
  userStatValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  userStatLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  userActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
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
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  becomeArtistButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  becomeArtistButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  editButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minWidth: 80,
  },
  editButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.surface,
  },
  uploadButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minWidth: 80,
  },
  uploadButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  createBoardButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minWidth: 80,
  },
  createBoardButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  filterContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
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
  artworkImageStyle: {
    width: '100%',
    height: '100%',
  },
  artworkInfo: {
    padding: theme.spacing.md,
  },
  artworkTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  artworkStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  artworkStatText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  loginButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  loginButtonText: {
    color: theme.colors.surface,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  registerButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  registerButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    color: theme.colors.surface,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.text,
  },
  forgotPassword: {
    textAlign: 'center',
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.sm,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  logoutButton: {
    backgroundColor: '#ff4757',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  loginTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  loginSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
});
