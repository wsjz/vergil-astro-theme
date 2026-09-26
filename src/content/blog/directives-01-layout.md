---
title: 结构排版指令
excerpt: 网格、选项卡、折叠、时间线、诗词、信纸、卷轴。这一类指令负责组织文章的版面结构。
publishDate: 'Aug 13 2026'
tags:
  - 使用指南
categories: ["博客相关"]
series: 内容指令示例
---

这一篇集中演示负责版面结构的指令。每个指令都分成**演示效果**与**示例代码**两个选项卡，可以边看边抄。

---
### Folding 折叠块

::::tabs
tab: 演示效果

:::folding{title="查看完整配置"}
```js
// astro.config.mjs
import remarkDirective from 'remark-directive';
import { remarkContentDirectives } from './src/plugins/remark-content-directives.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkContentDirectives]
  }
});
```
:::

:::folding{title="默认展开的折叠块" open="true"}
通过 `open="true"` 让折叠块默认展开。支持 `color` 属性自定义颜色。
:::

tab: 示例代码

`````
:::folding{title="查看完整配置"}
```js
import remarkDirective from 'remark-directive';
import { remarkContentDirectives } from './src/plugins/remark-content-directives.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkContentDirectives]
  }
});
```
:::

:::folding{title="默认展开的折叠块" open="true"}
通过 `open="true"` 让折叠块默认展开。支持 `color` 属性自定义颜色。
:::
`````

- `title` 折叠按钮上的文字
- `open="true"` 默认展开
- `color` 自定义颜色

::::

---

### Folders 多级折叠

::::tabs
tab: 演示效果

:::folders
folder: 第一章：基础概念

Astro 是一个**内容优先**的静态站点生成器。核心特点：

1. 零 JS 默认输出
2. 群岛架构
3. 支持 React / Vue / Svelte

folder: 第二章：组件系统

Astro 组件使用 `.astro` 后缀，语法类似 HTML + JS：

```astro
---
const name = 'Astro';
---
<h1>Hello {name}</h1>
```

folder: 第三章：内容集合

使用 [Content Collections](https://docs.astro.build/zh-cn/guides/content-collections/) 管理类型安全的内容。
:::

tab: 示例代码

`````
:::folders
folder: 第一章：基础概念

Astro 是一个**内容优先**的静态站点生成器。核心特点：

1. 零 JS 默认输出
2. 群岛架构
3. 支持 React / Vue / Svelte

folder: 第二章：组件系统

Astro 组件使用 `.astro` 后缀，语法类似 HTML + JS：

```astro
---
const name = 'Astro';
---
<h1>Hello {name}</h1>
```

folder: 第三章：内容集合

使用 [Content Collections](https://docs.astro.build/zh-cn/guides/content-collections/) 管理类型安全的内容。
:::
`````

- 每个 `folder: 标题` 开启一个新的折叠项
- 支持在内容中嵌套代码块、列表、链接等 Markdown 内容

::::

---

### Timeline 时间线

::::tabs
tab: 演示效果

:::timeline
- 2024-01 | 开始学习 Astro | 从官方文档入手，了解基本概念
- 2024-03 | 搭建个人博客 | 基于 Vergil 主题开始定制
- 2024-06 | 上线运营 | 正式部署到 GitHub Pages
- 2025-04 | 持续迭代 | 添加分类、专栏、内容指令等功能
:::

tab: 示例代码

````
:::timeline
- 2024-01 | 开始学习 Astro | 从官方文档入手，了解基本概念
- 2024-03 | 搭建个人博客 | 基于 Vergil 主题开始定制
- 2024-06 | 上线运营 | 正式部署到 GitHub Pages
- 2025-04 | 持续迭代 | 添加分类、专栏、内容指令等功能
:::
````

- 每条时间线以 `-` 开头，用 `|` 分隔**日期**、**标题**、**描述**
- 描述为可选

::::

---

### Tabs 选项卡

#### 演示效果

:::tabs
tab: 标签 A

这是**标签 A** 的内容。

tab: 标签 B{color=blue}

这是带 `color` 属性的**标签 B**。
:::

#### 示例代码

````
:::tabs
tab: 标签 A

这是**标签 A** 的内容。

tab: 标签 B{color=blue}

这是带 `color` 属性的**标签 B**。
:::
````

- `tab: 标签名` 后需要空一行，再写内容
- `tab: 标签名{color=blue}` 可给标签设置颜色

---

### Poetry 诗歌/引用

::::tabs
tab: 演示效果

:::poetry{title="游山西村" author="陆游"  footer="诗词节选" date="（宋）"}
莫笑农家腊酒浑，丰年留客足鸡豚。

**山重水复疑无路，柳暗花明又一村**

箫鼓追随春社近，衣冠简朴古风存。

从今若许闲乘月，拄杖无时夜叩门。
:::

tab: 示例代码

````
:::poetry{title="游山西村" author="陆游"  footer="诗词节选" date="（宋）"}
莫笑农家腊酒浑，丰年留客足鸡豚。

**山重水复疑无路，柳暗花明又一村**

箫鼓追随春社近，衣冠简朴古风存。

从今若许闲乘月，拄杖无时夜叩门。

:::
````

- `title` 诗歌标题
- `author` 作者
- `date` 日期/朝代

::::

---

### Reel 卷轴

::::tabs
tab: 演示效果

:::reel{title="卷轴示例" author="作者" date="2026-04-20" footer="卷轴底部"}
这是卷轴的内容，文字会从右向左竖排显示。

支持多段落内容。
:::

tab: 示例代码

`````markdown
:::reel{title="卷轴示例" author="作者" date="2026-04-20" footer="卷轴底部"}
这是卷轴的内容，文字会从右向左竖排显示。

支持多段落内容。
:::
`````

- `title`：卷轴标题
- `author`：作者信息
- `date`：日期
- `footer`：底部文字

::::

---

### Paper 纸张

::::tabs
tab: 演示效果

:::paper{title="文言文" author="诸葛亮" date="三国" footer="节选"}
出师表

<!-- paragraph -->
先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。

<!-- section 后出师表 -->
先帝深虑汉、贼不两立，王业不偏安，故托臣以讨贼也。

<!-- line right -->
臣鞠躬尽瘁，死而后已。
:::

tab: 示例代码

 `````markdown
:::paper{title="文言文" author="诸葛亮" date="三国" footer="节选"}
出师表

<!-- paragraph -->
先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。

<!-- section 后出师表 -->
先帝深虑汉、贼不两立，王业不偏安，故托臣以讨贼也。

<!-- line right -->
臣鞠躬尽瘁，死而后已。
:::
 `````

- `title`：纸张标题（居中）
- `author` / `date` / `footer`：作者、日期、底部文字
- 内容分区：
 - `<!-- paragraph -->`：普通段落（首行缩进）
 - `<!-- section 标题 -->`：带居中标题的章节
 - `<!-- line right -->`：右对齐行

::::

---

### Grid 网格布局

::::tabs
tab: 演示效果

:::grid{cols="3" gap="12"}
**快速开始**

```bash
npm create astro@latest
```

---

**核心概念**

- [群岛架构](https://docs.astro.build/)
- [内容集合](https://docs.astro.build/)
- [视图过渡](https://docs.astro.build/)

---

**部署指南**

1. 构建项目：`npm run build`
2. 选择平台：Vercel / Netlify / Cloudflare Pages
3. 一键部署
:::

tab: 示例代码

`````
:::grid{cols="3" gap="12"}
**快速开始**

```bash
npm create astro@latest
```

---

**核心概念**

- [群岛架构](https://docs.astro.build/)
- [内容集合](https://docs.astro.build/)
- [视图过渡](https://docs.astro.build/)

---

**部署指南**

1. 构建项目：`npm run build`
2. 选择平台：Vercel / Netlify / Cloudflare Pages
3. 一键部署
:::
`````

- `cols` 列数，可选 `2` | `3` | `4`，不传则按最小宽度自动换行
- `gap` 格子间距，单位 px
- `minw` 自动列数时的最小列宽，默认 `240px`
- `bg` 格子背景样式：`card`（默认） | `box` | `none`
- 用 `---` 分隔每个格子

::::
