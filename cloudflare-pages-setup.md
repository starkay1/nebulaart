# Cloudflare Pages 自动部署配置

## 🚀 GitHub 仓库已就绪
- 仓库地址: https://github.com/starkay1/nebulaart.git
- 所有修复已推送到 main 分支

## 📋 Cloudflare Pages 配置步骤

### 1. 登录 Cloudflare Pages
访问: https://dash.cloudflare.com/pages

### 2. 连接 GitHub 仓库
1. 点击 "Connect to Git"
2. 选择 "GitHub"
3. 授权 Cloudflare 访问你的 GitHub 账户
4. 选择仓库: `starkay1/nebulaart`

### 3. 构建配置
```
项目名称: nebulaart
生产分支: main
构建命令: npx expo export:web
构建输出目录: web-build
根目录: /
```

### 4. 环境变量 (可选)
```
NODE_VERSION: 18
```

### 5. 高级设置
- 兼容性日期: 2024-01-01
- 兼容性标志: 无需设置

## 🌐 自定义域名配置

### 设置 nebulaart.app
1. 在 Cloudflare Pages 项目中点击 "Custom domains"
2. 添加域名: `nebulaart.app`
3. 添加域名: `www.nebulaart.app`
4. 配置 DNS 记录 (如果域名在 Cloudflare 管理):
   - CNAME: nebulaart.app → your-project.pages.dev
   - CNAME: www.nebulaart.app → your-project.pages.dev

## 🔄 自动部署流程
- 每次推送到 main 分支会自动触发部署
- 构建时间约 2-3 分钟
- 部署成功后会自动更新网站

## 📊 预期结果
- 构建命令: `npx expo export:web` ✅
- 输出目录: `web-build` ✅
- 静态资源: 图片和 SVG 图标正常加载 ✅
- React Native Web: 完全兼容 ✅
