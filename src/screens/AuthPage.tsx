import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import { CloseIcon } from '../components/icons';

interface AuthPageProps {
  navigation?: any;
  route?: any;
}

export const AuthPage: React.FC<AuthPageProps> = ({ navigation }) => {
  const handleClose = () => {
    if (navigation) {
      navigation.goBack();
    }
  };
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    isArtist: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAppStore();

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('错误', '请填写完整的登录信息');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        Alert.alert('成功', '登录成功！');
        handleClose();
      } else {
        Alert.alert('错误', '邮箱或密码错误');
      }
    } catch (error) {
      Alert.alert('登录失败', '网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      Alert.alert('错误', '请填写完整的注册信息');
      return;
    }

    if (registerForm.password.length < 6) {
      Alert.alert('错误', '密码长度至少6位');
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(registerForm);
      if (success) {
        Alert.alert('注册成功', '欢迎加入星云艺术', [
          { text: '确定', onPress: handleClose }
        ]);
      } else {
        Alert.alert('注册失败', '邮箱已存在或网络错误');
      }
    } catch (error) {
      Alert.alert('注册失败', '网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>邮箱</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入邮箱"
          placeholderTextColor={theme.colors.textLight}
          value={loginForm.email}
          onChangeText={(text) => setLoginForm({ ...loginForm, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>密码</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入密码"
          placeholderTextColor={theme.colors.textLight}
          value={loginForm.password}
          onChangeText={(text) => setLoginForm({ ...loginForm, password: text })}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <LinearGradient
          colors={[...theme.gradients.primary]}
          style={styles.submitButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? '登录中...' : '登录'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderRegisterForm = () => (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>姓名</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入姓名"
          placeholderTextColor={theme.colors.textLight}
          value={registerForm.name}
          onChangeText={(text) => setRegisterForm({ ...registerForm, name: text })}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>邮箱</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入邮箱"
          placeholderTextColor={theme.colors.textLight}
          value={registerForm.email}
          onChangeText={(text) => setRegisterForm({ ...registerForm, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>密码</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入密码（至少6位）"
          placeholderTextColor={theme.colors.textLight}
          value={registerForm.password}
          onChangeText={(text) => setRegisterForm({ ...registerForm, password: text })}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRegisterForm({ 
          ...registerForm, 
          isArtist: !registerForm.isArtist 
        })}
      >
        <View style={[
          styles.checkbox,
          registerForm.isArtist && styles.checkboxChecked
        ]}>
          {registerForm.isArtist && (
            <Text style={styles.checkboxMark}>✓</Text>
          )}
        </View>
        <Text style={styles.checkboxLabel}>我是艺术家</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.disabledButton]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <LinearGradient
          colors={[...theme.gradients.primary]}
          style={styles.submitButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? '注册中...' : '注册'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>星云艺术</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <CloseIcon size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'login' && styles.activeTab
              ]}
              onPress={() => setActiveTab('login')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'login' && styles.activeTabText
              ]}>
                登录
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'register' && styles.activeTab
              ]}
              onPress={() => setActiveTab('register')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'register' && styles.activeTabText
              ]}>
                注册
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'login' ? renderLoginForm() : renderRegisterForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: 'white',
  },
  form: {
    paddingHorizontal: theme.spacing.lg,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxMark: {
    color: 'white',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  checkboxLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  submitButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: 'white',
  },
});
