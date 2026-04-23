---
title: 发布与部署
order: 6
---

# 发布与部署

本章介绍如何将网站构建为静态文件并部署到线上。

## SEO 与分享

在发布之前，建议为每篇文章配置好 SEO 信息，这样分享链接时能够显示预览卡片。

### 文章 SEO 配置

在博客文章的信息头中添加：

```markdown
---
title: 文章标题
seo:
  title: 分享时显示的标题
  description: 分享时显示的描述
  image: /images/share-cover.jpg
---
```

### 网站 SEO 配置

在 `src/data/site-config.ts` 中配置网站级的 SEO 信息：

```typescript
image: {
    src: '/vergil-preview.jpg',
    alt: 'Vergil 主题预览图'
}
```

## 构建与部署

### 本地构建

运行以下命令生成静态文件：

```bash
npm run build
```

构建完成后，静态文件会输出到 `dist/` 目录。

### 部署到 Vercel

1. 在 [Vercel](https://vercel.com/) 注册账号
2. 导入你的 GitHub 仓库
3. 框架预设选择 **Astro**
4. 点击部署

Vercel 会自动监听代码推送，每次提交后自动重新部署。

### 部署到 Netlify

1. 在 [Netlify](https://www.netlify.com/) 注册账号
2. 选择 **Add new site** → **Import an existing project**
3. 选择你的 GitHub 仓库
4. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击部署

### 部署到 GitHub Pages

1. 在仓库设置中启用 GitHub Pages
2. 选择 GitHub Actions 作为部署来源
3. 项目已包含 `.github/workflows/deploy.yml`，无需额外配置

:::callout{variant="tip"}
如果部署后页面样式丢失，请检查 `astro.config.mjs` 中的 `base` 配置是否正确设置为你的仓库名。
:::
