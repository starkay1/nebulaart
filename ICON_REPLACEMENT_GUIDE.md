# 🎨 Nebula Art Logo 替换指南

## 📋 需要替换的文件

您需要将提供的星云logo图片制作成以下不同尺寸，并替换对应的文件：

### 1. Web 图标文件 (public/ 目录)
- `public/favicon.ico` - 16x16 或 32x32 (浏览器标签页图标)
- `public/favicon-16x16.png` - 16x16
- `public/favicon-32x32.png` - 32x32
- `public/icon-72x72.png` - 72x72
- `public/icon-96x96.png` - 96x96
- `public/icon-128x128.png` - 128x128
- `public/icon-192x192.png` - 192x192 (PWA 图标)
- `public/icon-512x512.png` - 512x512 (PWA 图标)

### 2. 移动应用图标文件 (assets/ 目录)
- `assets/icon.png` - 1024x1024 (主图标)
- `assets/favicon.png` - 32x32 (Web favicon)
- `assets/adaptive-icon.png` - 1024x1024 (Android 自适应图标)
- `assets/splash.png` - 1284x2778 (启动画面，可选)

## 🛠️ 推荐工具

### 在线图标生成器
1. **Favicon.io** (https://favicon.io/)
   - 上传您的星云logo图片
   - 自动生成所有需要的尺寸
   - 下载完整的图标包

2. **RealFaviconGenerator** (https://realfavicongenerator.net/)
   - 更专业的图标生成
   - 支持各种平台优化
   - 提供完整的HTML代码

### 本地工具
- **ImageMagick** - 命令行批量转换
- **Photoshop** - 专业图像处理
- **GIMP** - 免费图像编辑器

## 📝 替换步骤

1. **准备原图**
   - 确保星云logo图片为正方形
   - 推荐分辨率至少 1024x1024
   - 背景透明或深色背景

2. **生成图标**
   ```bash
   # 使用 ImageMagick 批量生成 (示例)
   convert nebula-logo.png -resize 16x16 public/favicon-16x16.png
   convert nebula-logo.png -resize 32x32 public/favicon-32x32.png
   convert nebula-logo.png -resize 72x72 public/icon-72x72.png
   convert nebula-logo.png -resize 96x96 public/icon-96x96.png
   convert nebula-logo.png -resize 128x128 public/icon-128x128.png
   convert nebula-logo.png -resize 192x192 public/icon-192x192.png
   convert nebula-logo.png -resize 512x512 public/icon-512x512.png
   convert nebula-logo.png -resize 1024x1024 assets/icon.png
   ```

3. **替换文件**
   - 将生成的图标文件复制到对应目录
   - 保持文件名不变

4. **重新构建**
   ```bash
   npm run build
   ```

## ✅ 验证替换

替换完成后，您可以通过以下方式验证：

1. **浏览器标签页** - 查看是否显示新的星云logo
2. **PWA 安装** - 检查应用图标是否更新
3. **移动设备** - 在手机上查看应用图标

## 🎯 注意事项

- 保持图标的视觉一致性
- 确保在小尺寸下仍然清晰可见
- 考虑不同背景下的显示效果
- 测试在各种设备和浏览器上的显示

## 🚀 部署

替换完成后，重新部署应用：

```bash
git add .
git commit -m "Update: Replace logo with Nebula Art branding"
git push origin main
```

Cloudflare Pages 将自动部署更新后的图标。
