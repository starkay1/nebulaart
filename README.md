# Nebula Art —— 用 AI 重建艺术社区

<div align="center">

![Nebula Art Logo](https://via.placeholder.com/200x80/8b5cf6/ffffff?text=Nebula+Art)

**一款由 AI 驱动的艺术创作与发现平台**

完美还原 HTML 原型为原生 React Native 应用，用户可浏览、关注艺术家、发起策展，打造属于自己的数字艺术画廊。

[![React Native](https://img.shields.io/badge/React%20Native-0.76.3-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~52.0.11-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

## 🎨 项目简介

Nebula Art 是一款由 AI 驱动的艺术创作与发现平台，完美还原 HTML 原型为原生 React Native 应用。用户可浏览、关注艺术家、发起策展，打造属于自己的数字艺术画廊。

### ✨ 核心功能

- 🎭 **艺术家发现** - 浏览和关注优秀艺术家，建立艺术社交网络
- 🖼️ **作品展示** - 瀑布流布局展示精美艺术作品
- 📚 **策展系统** - 创建和浏览主题策展，深度体验艺术内容
- 💫 **动态故事** - 脉冲动画效果的故事功能，实时分享创作动态
- 🎨 **创作工具** - 浮动创建按钮，快速上传作品、创建画板、发起策展
- 🌙 **暗黑模式** - 完整的明暗主题切换支持
- ♿ **无障碍访问** - 全面的屏幕阅读器支持和无障碍标签
- 📱 **刘海屏适配** - 完美支持各种设备的安全区域和刘海屏

## 🚀 技术栈

- **前端框架**: React Native + Expo + TypeScript
- **状态管理**: Zustand - 轻量级状态管理解决方案
- **导航系统**: React Navigation（Tab + Stack + Modal）
- **图像处理**: react-native-image-picker - 相册和相机访问
- **图标系统**: react-native-svg - 自定义 SVG 图标组件
- **动画效果**: React Native Reanimated & Animated API
- **渐变效果**: expo-linear-gradient
- **模糊效果**: expo-blur
- **安全区域**: react-native-safe-area-context
- **部署平台**: Expo Go / iOS App Store / Google Play

## 📁 项目结构

```bash
src/
├── components/           # 可复用组件
│   ├── icons/           # 自定义 SVG 图标组件
│   │   ├── HomeIcon.tsx
│   │   ├── SearchIcon.tsx
│   │   ├── CreateIcon.tsx
│   │   └── ...
│   ├── modals/          # 模态框组件
│   └── CreateButton.tsx # 浮动创建按钮
├── screens/             # 页面组件
│   ├── HomePage.tsx           # 首页 - 故事和作品流
│   ├── CurationCenterPage.tsx # 策展中心
│   ├── ArtistHubPage.tsx      # 艺术家中心
│   ├── ProfilePage.tsx        # 个人资料页
│   ├── ArtistPage.tsx         # 艺术家详情页
│   └── CurationDetailPage.tsx # 策展详情页
├── store/               # 状态管理
│   └── appStore.ts      # Zustand 全局状态
├── theme/               # 设计系统
│   └── theme.ts         # 主题配置
├── utils/               # 工具函数
│   ├── safeArea.ts      # 安全区域工具
│   └── accessibility.ts # 无障碍访问工具
├── navigation/          # 导航配置
└── App.tsx              # 应用入口
```

## 🛠️ 如何运行

### 环境要求

- Node.js (v18 或更高版本)
- npm 或 yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS 模拟器（iOS 开发）或 Android 模拟器（Android 开发）

### 快速开始

1. **安装依赖**
   ```bash
   npx expo install
   ```

2. **启动开发服务器**
   ```bash
   npx expo start
   ```

3. **在设备上运行**
   - 按 `i` 键在 iOS 模拟器中运行
   - 按 `a` 键在 Android 模拟器中运行
   - 使用 Expo Go 应用扫描二维码在真机上运行

### 📱 设备测试

- **iOS**: 需要 iOS 13.4 或更高版本
- **Android**: 需要 Android 6.0 (API 23) 或更高版本
- **Web**: 支持现代浏览器预览（实验性功能）

## Key Dependencies

```json
{
  "expo": "~52.0.11",
  "react": "18.3.1",
  "react-native": "0.76.3",
  "@react-navigation/native": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "@react-navigation/stack": "^6.x",
  "react-native-screens": "^3.x",
  "react-native-safe-area-context": "^4.x",
  "react-native-gesture-handler": "^2.x",
  "react-native-reanimated": "^3.x",
  "zustand": "^4.x",
  "react-native-svg": "^15.x",
  "expo-linear-gradient": "^13.x",
  "expo-blur": "^13.x",
  "expo-status-bar": "^1.x"
}
```

## 🔧 开发者提示

### 🎨 设计系统使用
- 所有设计变量来自 `src/theme/theme.ts`
- 使用主题变量而非硬编码值：`theme.colors.primary`
- 统一的间距系统：`theme.spacing.md`
- 渐变色配置：`theme.gradients.primary`

### 🎯 图标系统
- 所有图标位于 `src/components/icons/`
- 支持自定义大小、颜色和填充状态
- 已添加完整的无障碍标签支持

### 👤 用户功能
- "成为艺术家"功能需通过"我的"页面触发
- 用户可以关注/取消关注艺术家
- 支持暗黑模式切换

### 📸 作品上传
- 作品上传依赖 camera roll 权限
- 支持从相册选择或相机拍摄
- 需要在 app.json 中配置相应权限

### ♿ 无障碍访问
- 所有交互元素都有 `accessibilityLabel`
- 支持屏幕阅读器
- 符合 WCAG 2.1 AA 标准

### 📱 设备适配
- 完美支持刘海屏和动态岛
- 自动适配安全区域
- 响应式布局设计

## 🤖 开发方式

本项目采用 **AI 协作开发** 模式，使用 **Claude Sonnet 4 + Windsurf** 实现全栈自动化构建：

- 🎨 **设计还原**: 从 HTML 原型完美还原到 React Native
- 🔧 **代码生成**: AI 自动生成组件、页面和业务逻辑
- 🐛 **问题修复**: 智能识别和修复 TypeScript 类型错误
- ♿ **无障碍优化**: 自动添加完整的无障碍访问支持
- 📱 **设备适配**: 智能处理各种设备的安全区域适配
- 🌙 **功能扩展**: AI 驱动的暗黑模式和高级功能实现

### AI 开发优势
- ⚡ **快速迭代**: 从概念到可运行应用仅需几小时
- 🎯 **高质量代码**: 遵循最佳实践和 TypeScript 严格模式
- 🔄 **持续优化**: 实时代码审查和性能优化
- 📚 **完整文档**: 自动生成专业级项目文档

## 📸 应用截图

<div align="center">

### 🏠 首页 - 艺术作品流
![首页截图](https://via.placeholder.com/300x600/8b5cf6/ffffff?text=首页)

### 🎨 艺术家中心
![艺术家中心](https://via.placeholder.com/300x600/6d28d9/ffffff?text=艺术家中心)

### 📚 策展中心
![策展中心](https://via.placeholder.com/300x600/a78bfa/ffffff?text=策展中心)

### 👤 个人资料
![个人资料](https://via.placeholder.com/300x600/8b5cf6/ffffff?text=个人资料)

</div>

> 💡 **提示**: 实际截图将在应用完成后更新

## 🎯 核心特性详解

### 🎭 智能推荐系统
- 基于用户喜好的个性化内容推荐
- 艺术家和作品的智能匹配算法
- 实时更新的热门内容发现

### 📱 交互体验
- **脉冲动画**: 故事头像周围的动态脉冲效果
- **流畅过渡**: 页面切换和状态变化的平滑动画
- **手势支持**: 直观的滑动、点击和长按交互
- **反馈机制**: 即时的视觉和触觉反馈

### 🔐 数据安全
- 本地数据加密存储
- 安全的用户认证机制
- 隐私保护和数据最小化原则

## 🚀 部署和发布

### 开发环境
```bash
# 启动开发服务器
npx expo start

# 清除缓存重启
npx expo start -c

# 在特定平台运行
npx expo start --ios
npx expo start --android
```

### 生产构建
```bash
# 构建 iOS 应用
eas build --platform ios

# 构建 Android 应用
eas build --platform android

# 构建所有平台
eas build --platform all
```

### 发布到应用商店
```bash
# 提交到 App Store
eas submit --platform ios

# 提交到 Google Play
eas submit --platform android
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. 🍴 Fork 本仓库
2. 🌟 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 💻 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 📤 推送到分支 (`git push origin feature/AmazingFeature`)
5. 🔄 创建 Pull Request

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 编写有意义的提交信息
- 添加适当的测试用例
- 确保无障碍访问支持

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢 [Expo](https://expo.dev/) 提供优秀的开发平台
- 感谢 [React Native](https://reactnative.dev/) 社区的贡献
- 感谢所有为开源社区做出贡献的开发者

## 📞 联系我们

- 📧 邮箱: contact@nebula-art.com
- 🐦 Twitter: [@NebulaArtApp](https://twitter.com/NebulaArtApp)
- 💬 Discord: [Nebula Art Community](https://discord.gg/nebula-art)

---

<div align="center">

**© 2025 Nebula Art. All rights reserved.**

*用 AI 重新定义艺术社区的未来*

</div>
