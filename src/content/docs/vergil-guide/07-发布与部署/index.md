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

在 `src/data/config/identity.ts` 中配置网站级的 SEO 信息：

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

### 选择部署平台

::::tabs
tab: Vercel

1. 在 [Vercel](https://vercel.com/) 注册账号
2. 导入你的 GitHub 仓库
3. 框架预设选择 **Astro**
4. 点击部署

Vercel 会自动监听代码推送，每次提交后自动重新部署。

tab: EdgeOne Pages（国内）

[EdgeOne Pages](https://cloud.tencent.com/product/teo) 是腾讯云推出的静态网站托管服务，部署在国内边缘节点，适合主要面向国内读者的站点。

1. 登录 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 进入 **Pages** 服务，点击**新建项目**
3. 选择**导入 Git 仓库**，授权并选择你的代码仓库
4. 填写构建设置：
   - **框架预设**：选择 **Astro**（或**静态网站**）
   - **构建命令**：`npm run build`
   - **输出目录**：`dist`
5. 点击**部署**，等待构建完成

EdgeOne Pages 会自动监听代码推送。构建完成后，可在控制台绑定自定义域名并开启 HTTPS。

:::callout{type="tip"}
**关于备案：**

- **使用默认域名**（如 `xxx.edgeone.app`）**无需备案**，海外和国内均可访问
- **绑定自定义域名**指向国内节点时需要已备案域名
:::

tab: Netlify

1. 在 [Netlify](https://www.netlify.com/) 注册账号
2. 选择 **Add new site** → **Import an existing project**
3. 选择你的 GitHub 仓库
4. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击部署

tab: GitHub Pages

1. 在仓库设置中启用 GitHub Pages
2. 选择 GitHub Actions 作为部署来源
3. 创建 GitHub Actions 工作流文件 `.github/workflows/deploy.yml`（可参考 Astro 官方部署文档）

::::

:::callout{type="tip"}
如果部署后页面样式丢失，请检查 `astro.config.mjs` 中的 `base` 配置是否正确设置为你的仓库名。
:::
