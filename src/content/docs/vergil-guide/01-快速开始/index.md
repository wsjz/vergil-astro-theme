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

:::callout{variant="tip"}
开发服务器支持**热更新**——你修改文件后，浏览器会自动刷新，无需手动重启。
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
│   │   └── site-config.ts ← 站点配置文件
│   └── pages/            ← 页面路由
├── public/               ← 静态资源（图片、字体等）
└── package.json
```

作为内容创作者，你最常接触的是 `src/content/` 和 `src/data/site-config.ts` 这两个目录。

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

:::callout{variant="note"}
文件头部的 `---` 之间的内容称为**信息头**，用于填写文章的标题、日期、标签等元信息。系统会读取这些信息来决定文章的展示方式。
:::

## 下一步

- 了解如何[配置站点信息](../02-站点配置/)
- 了解有哪些[内容形式](../03-基本创作/内容形式/)可供选择
- 学习使用[内容指令](../03-基本创作/内容指令/)美化文章
