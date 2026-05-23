---
title: 快速开始
order: 1
---

# 快速开始

本章将带你完成 Vergil 主题的安装、启动和第一篇内容的发布。

## 环境要求

你的电脑需要安装：

- [Node.js](https://nodejs.org/) 18 或更高版本
- 一个代码编辑器（推荐 [VS Code](https://code.visualstudio.com/)）
- [Git](https://git-scm.com/)（用于版本管理）

## 安装步骤

### 1. 克隆项目

打开终端，运行以下命令：

```bash
git clone https://github.com/justgoodui/vergil-astro-theme.git my-blog
cd my-blog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

命令执行后，终端会显示本地访问地址，通常是 `http://localhost:4321/`。用浏览器打开即可看到网站。

:::callout{type="tip"}
开发服务器支持**热更新**——你修改文件后，浏览器会自动刷新，无需手动重启。
:::

## 变成你的站点（最少改动）

网站跑起来了，但展示的还是示例内容。下面这 5 项改完，网站就变成你的了。

### 1. 网站名和描述

打开 `src/data/config/identity.ts`，修改：

```typescript
export const siteInfo = {
    title: '我的博客',           // ← 改成你的网站名
    subtitle: '记录技术与生活',  // ← 改成你的副标题
    description: '...',          // ← 改成你的站点描述
};
```

### 2. 首页 Hero

同一个文件里，修改 `heroData`：

```typescript
export const heroData = {
    title: 'Hello，我是 **张三**!',
    text: '我是 **张三**，一名前端开发者...',
    // ...
};
```

### 3. 顶部导航菜单

打开 `src/data/config/nav.ts`，修改 `headerNavLinks`。去掉不想要的菜单项，添加你自己的：

```typescript
export const headerNavLinks = [
    {
        label: '博客',
        icon: 'BookOpen',
        children: [
            { label: '主页', href: '/', icon: 'Home' },
            { label: '博客', href: '/blog', icon: 'FileText' },
            { label: '相册', href: '/albums', icon: 'Image' },
        ]
    }
];
```

### 4. 底部链接

同一个文件里，修改 `footerNavLinks`（页脚导航）：

```typescript
export const footerNavLinks = [
    { text: '关于', href: '/about' },
    { text: '联系', href: '/contact' },
    { text: 'GitHub', href: 'https://github.com/yourname' },
];
```

### 5. 头像

把你的头像图片替换掉 `src/assets/images/avatar.jpg`，同名覆盖即可。

:::callout{type="tip"}
**改完这 5 项，刷新浏览器，网站就是你的了。**

其他配置（评论、搜索、开屏页、边栏等）都是可选的，之后有空再慢慢调整。
:::

## 项目结构

安装完成后，你会看到以下目录结构：

```
my-blog/
├── src/
│   ├── content/          ← 所有内容文件放在这里
│   │   ├── blog/         ← 博客文章
│   │   ├── moments/      ← 瞬间（图文动态）
│   │   ├── thoughts/     ← 想法（碎片化笔记）
│   │   ├── albums/       ← 相册
│   │   ├── projects/     ← 项目展示
│   │   ├── docs/         ← 知识库
│   │   └── pages/        ← 独立页面（关于、留言等）
│   ├── data/
│   │   ├── site-config.ts     ← 站点配置入口（首次打开建议看这里）
│   │   └── config/            ← 按功能拆分的配置子模块
│   │       ├── nav.ts         ← 导航、视图、底部导航
│   │       ├── identity.ts    ← 网站信息、Hero、订阅
│   │       ├── features.ts    ← 搜索、评论、边栏等功能开关
│   │       ├── splash.ts      ← 开屏页
│   │       ├── links.ts       ← 网站卡片链接分组
│   │       └── fonts.ts       ← 字体注册表
│   └── pages/            ← 页面路由
├── public/               ← 静态资源（图片、字体等）
└── package.json
```

## 发布第一篇文章

在 `src/content/blog/` 目录下新建一个 Markdown 文件，文件名格式为 `文章标题.md`：

```markdown
---
title: 我的第一篇文章
publishDate: 2026-04-23
tags:
  - 随笔
---

这是我的第一篇博客文章。

Vergil 支持 Markdown 的所有基础语法：

- 列表项
- **加粗文字**
- [链接文字](https://example.com)

保存文件后，刷新浏览器即可看到新文章。
```

:::callout{type="info"}
文件头部的 `---` 之间的内容称为**信息头**，用于填写文章的标题、日期、标签等元信息。系统会读取这些信息来决定文章的展示方式。
:::

## 使用外部图片

文章中使用在线图片（如 `![描述](https://example.com/photo.jpg)`）时，需要先将域名加入 `astro.config.mjs` 的白名单：

```js
// astro.config.mjs
export default defineConfig({
  image: {
    domains: ['images.unsplash.com', '你的域名.com']
  }
});
```

不加白名单的外部图片会被拦截，只显示 alt 文字。本地图片（`public/` 目录下）无需配置。

## 下一步

- 了解如何[配置站点信息](/docs/vergil-guide/02-站点配置/)
- 了解有哪些[内容形式](/docs/vergil-guide/03-基本创作/内容形式/)可供选择
- 学习使用[内容指令](/docs/vergil-guide/03-基本创作/内容指令/)美化文章
