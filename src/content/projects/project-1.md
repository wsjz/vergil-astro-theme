---
title: Vergil 主题
description: 一套基于 Astro 的内容站点框架，把排版组件做成了 Markdown 指令，写文章的人不用碰组件和 CSS。
publishDate: 'Jun 18 2026'
isFeatured: true
seo:
  image:
    src: '../../assets/images/project-1.jpg'
    alt: Vergil 主题预览
---

![Vergil 主题预览](../../assets/images/project-1.jpg)

:::callout{type="tip" title="这是示例项目"}
项目页面的内容就是普通 Markdown，支持全部指令。改 `src/content/projects/` 下的文件即可。
:::

## 要解决的问题

大多数博客主题给你一套好看的默认排版，但一旦想在文章里放点别的东西——一个对比表、一条时间线、一张图表——就只能自己写 HTML，或者切到 MDX 去引组件。

写作的节奏会被打断。你本来在想怎么把一件事说清楚，结果开始查 Tailwind 的类名。

## 做法

把这些东西全部做成 Markdown 指令，用 `:::` 包起来，解析在构建期完成，不往浏览器里塞运行时。

::::grid{cols="3" gap="12"}
**指令**

50 个，覆盖排版、卡片、图表、媒体、时间规划

---

**内容形态**

文章、专栏、文档、相册、动态、想法、项目

---

**运行时**

零 JavaScript 框架，指令在构建期展开成静态 HTML
::::

## 进展

:::timeline
- 2025-06 | 从 Dante 分叉 | 保留极简排版的底子，开始加内容指令
- 2025-11 | 指令体系成型 | 容器指令和行内指令分开处理，支持嵌套
- 2026-03 | 多视图 | 默认视图之外加了沉浸阅读和简历视图
- 2026-06 | 界面语言 | 主题文案抽成字典，支持中英切换
:::

## 仓库

:::ghcard{type="repo" repo="wsjz/vergil-astro-theme"}
:::
