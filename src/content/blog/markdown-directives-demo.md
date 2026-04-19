---
title: Markdown 内容指令示例
excerpt: 展示在普通 `.md` 文件中直接使用所有内容指令的效果。每个指令都用「演示效果」和「示例代码」两个选项卡对照呈现，方便复制使用。
publishDate: 'Apr 15 2026'
banner: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&h=400&fit=crop&q=80
tags:
  - 使用指南
category: 博客相关
series: 博客搭建指南
isFeatured: true
---

在普通 `.md` 文章里直接使用 `:::` 和 `:` 语法，无需 import，无需 MDX。下面每个指令都分成了**演示效果**与**示例代码**两个选项卡，方便你边预览边复制。

---

## 块级组件

### Callout 提示块

::::tabs
tab: 演示效果

:::callout{type="info"}
这是一条**信息提示**，适合补充说明背景知识。
:::

:::callout{type="tip" title="小技巧"}
通过 `title` 属性自定义标题。
:::

:::callout{type="warn"}
这是一条**注意事项**，提醒读者小心的地方。
:::

:::callout{type="danger" title="危险操作"}
执行此操作前请务必备份数据。
:::

tab: 示例代码

````
:::callout{type="info"}
这是一条**信息提示**，适合补充说明背景知识。
:::

:::callout{type="tip" title="小技巧"}
通过 `title` 属性自定义标题。
:::

:::callout{type="warn"}
这是一条**注意事项**，提醒读者小心的地方。
:::

:::callout{type="danger" title="危险操作"}
执行此操作前请务必备份数据。
:::
````

- `type` 可选值：`info` | `tip` | `warn` | `danger`
- `title` 可自定义标题，不传则使用默认值

::::

---

### Note 主题色提示

::::tabs
tab: 演示效果

:::note
使用博客**主题色**的轻量提示块。支持 `color` 属性。
:::

:::note{title="关于本站" color="blue"}
- `blue`：科技蓝
- `green`：自然绿
- `red`：警示红
- `yellow`：活力黄
- `purple`：优雅紫
:::

tab: 示例代码

````
:::note
使用博客**主题色**的轻量提示块。支持 `color` 属性。
:::

:::note{title="关于本站" color="blue"}
- `blue`：科技蓝
- `green`：自然绿
- `red`：警示红
- `yellow`：活力黄
- `purple`：优雅紫
:::
````

- `color` 可选值：`blue`、`green`、`red`、`yellow`、`purple` 或任意十六进制色值
- `title` 可设置标题

::::

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

:::poetry{title="静夜思" author="李白" date="唐"}
床前明月光，

疑是地上霜。

举头望明月，

低头思故乡。
:::

tab: 示例代码

````
:::poetry{title="静夜思" author="李白" date="唐"}
床前明月光，

疑是地上霜。

举头望明月，

低头思故乡。
:::
````

- `title` 诗歌标题
- `author` 作者
- `date` 日期/朝代

::::

---

### Copy 一键复制

::::tabs
tab: 演示效果

:::copy{label="安装"}
pnpm add remark-directive unist-util-visit
:::

:::copy{label="SSH"}
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA example@example.com
:::

tab: 示例代码

````
:::copy{label="安装"}
pnpm add remark-directive unist-util-visit
:::

:::copy{label="SSH"}
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA example@example.com
:::
````

- `label` 左侧标签文字
- 内容区域会被处理为一行纯文本，点击右侧按钮即可复制

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

---

### Quot 引言

::::tabs
tab: 演示效果

:::quot{icon="x"}
代码是写给人看的，顺便让机器执行。
:::

tab: 示例代码

````
:::quot{icon="x"}
代码是写给人看的，顺便让机器执行。
:::
````

- `icon` 可自定义图标，不传则使用默认引号图标

::::

---

## 行内指令

### 文字装饰

::::tabs
tab: 演示效果

- 高亮：:mark[默认主题色高亮] 和 :mark[黄色高亮]{color="yellow"} 和 :mark[红色高亮]{color="red"}
- 下划线：:u[实线下划线] 和 :u[蓝色下划线]{color="blue"}
- 着重号：:emp[着重号下划线]（点状）
- 波浪线：:wavy[波浪下划线]
- 删除线：:del[已删除的内容]
- 上标：H:sup[2]O 和 注释:sup[1]{color="red"}
- 下标：CO:sub[2] 和 H:sub[2]O

tab: 示例代码

````
- 高亮：:mark[默认主题色高亮] 和 :mark[黄色高亮]{color="yellow"} 和 :mark[红色高亮]{color="red"}
- 下划线：:u[实线下划线] 和 :u[蓝色下划线]{color="blue"}
- 着重号：:emp[着重号下划线]（点状）
- 波浪线：:wavy[波浪下划线]
- 删除线：:del[已删除的内容]
- 上标：H:sup[2]O 和 注释:sup[1]{color="red"}
- 下标：CO:sub[2] 和 H:sub[2]O
````

- `:mark` 的 `color` 可选值：`yellow`、`red`、`green`、`blue`、`purple` 或任意色值
- `:u`、`:sup`、`:sub` 同样支持 `color` 属性

::::

---

### 交互效果

::::tabs
tab: 演示效果

- 键盘按键：按 :kbd[Ctrl+C] 复制，按 :kbd[Ctrl+V] 粘贴，按 :kbd[⌘+K] 搜索
- 模糊遮罩：:blur[点击可以查看隐藏内容]（点击揭示）
- 密码遮罩：密码是 :psw[MySecretPassword123]（点击显示）

tab: 示例代码

````
- 键盘按键：按 :kbd[Ctrl+C] 复制，按 :kbd[Ctrl+V] 粘贴，按 :kbd[⌘+K] 搜索
- 模糊遮罩：:blur[点击可以查看隐藏内容]（点击揭示）
- 密码遮罩：密码是 :psw[MySecretPassword123]（点击显示）
````

- `:blur` 点击后移除模糊效果
- `:psw` 点击后显示明文

::::

---

### 标签与按钮

::::tabs
tab: 演示效果

- 标签：:hashtag[Astro]{href="/tags/astro" color="blue"} :hashtag[博客]{href="/tags/blog" color="green"} :hashtag[教程]{href="/tags/tutorial" color="purple"}
- 按钮：:button[查看文档]{href="/" color="accent"} :button[GitHub]{href="/" color="blue"}

tab: 示例代码

````
- 标签：:hashtag[Astro]{href="/tags/astro" color="blue"} :hashtag[博客]{href="/tags/blog" color="green"} :hashtag[教程]{href="/tags/tutorial" color="purple"}
- 按钮：:button[查看文档]{href="/" color="accent"} :button[GitHub]{href="/" color="blue"}
````

- `:hashtag` 的 `href` 为跳转链接，`color` 可自定义颜色
- `:button` 的 `href` 为跳转链接，`color` 可自定义颜色

::::

---

### Image 图片

::::tabs
tab: 演示效果

::image{src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="风景照片"}

::image{src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" alt="带下载按钮" download="true"}

::image{src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" alt="正方形裁剪" ratio="1/1" width="300px"}

tab: 示例代码

````
::image{src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="风景照片"}

::image{src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" alt="带下载按钮" download="true"}

::image{src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" alt="正方形裁剪" ratio="1/1" width="300px"}
````

- `src`（**必填**）：图片地址
- `alt`：图片描述，会显示在图片下方作为 caption
- `width` / `height`：设置图片尺寸
- `bg`：背景颜色
- `padding`：内边距
- `ratio`：固定宽高比
- `download`：`true` 或自定义下载链接
- `fancybox`：`false` 可禁用点击放大

::::

---

### Gallery 图片画廊

::::tabs
tab: 演示效果

:::gallery{layout="grid" size="m" ratio="square"}
![山景1](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80)
![山景2](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80)
![森林](https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80)
![湖泊](https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80)
:::

tab: 示例代码

````
:::gallery{layout="grid" size="m" ratio="square"}
![山景1](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80)
![山景2](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80)
![森林](https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80)
![湖泊](https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80)
:::
````

- `layout`：`grid`（网格，默认）或 `flow`（瀑布流）
- `size`：`xs` | `s` | `m` | `l` | `xl` | `mix`
- `ratio`：`square` | `portrait`

::::

---

### Banner 横幅

::::tabs
tab: 演示效果

:::banner{title="Vergil 主题" subtitle="Astro 驱动的个人博客主题" bg="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"}
:::

tab: 示例代码

````
:::banner{title="Vergil 主题" subtitle="Astro 驱动的个人博客主题" bg="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"}
:::
````

- `title`（**必填**）：主标题
- `subtitle`：副标题
- `bg`：背景图片地址
- `avatar`：头像图片地址
- `link`：点击跳转链接

::::

---

### Terminal 终端代码块

```bash terminal
npm install tailwindcss @tailwindcss/postcss postcss
```

```bash terminal title="配置文件"
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  }
}
```

---

### Grid 多列步骤示例

:::grid{cols="2" bg="none" gap="16"}
:step-brackets[01]{title="创建项目"}

Start by creating a new Vite project if you don't have one set up already.

---

```bash terminal
npm create vite@latest my-project
cd my-project
```
:::

:::grid{cols="2" bg="none" gap="16"}
:step-brackets[02]{title="安装依赖"}

安装 `tailwindcss` 和 `@tailwindcss/vite`  via npm。

---

```bash terminal
npm install tailwindcss @tailwindcss/vite
```
:::

:::grid{cols="2" bg="none" gap="16"}
:step-brackets[03]{title="修改配置文件"}

在 `vite.config.ts` 中引入插件：

---

```bash terminal title="vite.config.ts" highlight="2,6-7"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```
:::

:::grid{cols="2" bg="none" gap="16"}
:step-brackets[04]{title="显示行号的 Terminal"}

通过 `linenos` 属性让 terminal 显示行号。

---

```bash terminal title="安装依赖" linenos highlight="2"
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```
:::

