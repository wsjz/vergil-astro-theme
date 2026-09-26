---
title: 卡片与链接指令
excerpt: 数字名片、网站卡片、海报墙。把链接变成有信息量的卡片，而不是一行蓝字。
publishDate: 'Aug 19 2026'
tags:
  - 使用指南
categories: ["博客相关"]
series: 内容指令示例
---

把一条链接展开成卡片。名片、网站卡、海报墙三种形态，数据可以写在指令里，也可以放在配置里统一管理。

---
### 数字名片 (yoicard)

文章末尾的"数字名片",1.75:1 横版比例,接近实体名片的厚纸质感。支持背景图/色/纹理/渐变、logo、Lucide icon、二维码、自定义字体和颜色。

::::tabs
tab: 演示效果

:::yoicard{name="你的名字" role="写作者 · 摄影爱好者"}

折腾博客和摄影的开发者 — *记录每一次心动*

<!-- contact -->

**alex.dev**
alex@example.com
:::

:::yoicard{name="全图背景" role="bg-image full" bg-image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80" bg-overlay="dark" accent="#fbbf24" icon="lucide:sparkles" logo="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80" qr="https://alex.dev"}

满配:全图 + 暗化遮罩 + 圆 logo + sparkles icon + 二维码

<!-- contact -->

**alex.dev**
alex@example.com
:::

:::yoicard{name="半图(右)" role="bg-mode right" bg-image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80" bg-mode="right"}

图覆盖右半,文字在左侧白底

<!-- contact -->

**alex.dev**
alex@example.com
:::

:::yoicard{name="深色撞色" role="bg + accent" bg="#1a3a2e" accent="#d4af37" icon="lucide:zap" font-name="Georgia, serif"}

深底自动反白字 — *衬线名字 + 金色 accent*

<!-- contact -->

**alex.dev**
alex@example.com
:::

:::yoicard{name="渐变温暖" role="warm gradient" bg-gradient="135deg, #fef3c7, #fed7aa" name-color="#c0392b"}

文艺感渐变 + 自定义 name 颜色
:::

tab: 示例代码

`````markdown
:::yoicard{name="你的名字" role="写作者 · 摄影爱好者"}

折腾博客和摄影的开发者 — *记录每一次心动*

<!-- contact -->

**alex.dev**
alex@example.com
:::

:::yoicard{name="全图背景" role="bg-image full" bg-image="..." bg-overlay="dark" accent="#fbbf24" icon="lucide:sparkles" logo="..." qr="https://alex.dev"}

满配:全图 + 暗化遮罩 + 圆 logo + sparkles icon + 二维码

<!-- contact -->

**alex.dev**
alex@example.com
:::
`````

**身份**
- `name`(必填):名字
- `role`:头衔/简介(单行)

**背景**(四选一,优先级 image > gradient > pattern > color)
- `bg`:纯色,如 `#1a3a2e`
- `bg-image`:图片 URL/路径
- `bg-pattern`:`diagonal` \| `dots` \| `grid` \| `grain`
- `bg-gradient`:CSS 渐变,如 `"135deg, #fef3c7, #fed7aa"`
- `bg-mode`(图专属):`full`(默认) \| `left` \| `right`
- `bg-overlay`(仅 full):`dark`(默认) \| `light` \| `none` \| 自定义颜色

**装饰**
- `logo`:右上角 logo 图(默认圆形)
- `logo-shape`:`circle`(默认) \| `square` \| `rounded`
- `icon`:左上角 Iconify 图标,如 `lucide:sparkles`
- `qr`:二维码内容(URL),build 时生成 SVG
- `accent`:左上角线/icon 颜色

**字体**
- `font-name`:名字字体(完整 font-family 字符串)
- `font-body`:其余文字字体

**配色**
- `text`:`auto`(默认按背景反转) \| `light` \| `dark` \| `#hex`
- `name-color` / `role-color`:覆盖单个文字颜色

**Slot 写法**
- 开始标签和 `<!-- contact -->` 之间 = bio(自由 Markdown,以斜体小字呈现)
- `<!-- contact -->` 之后 = 联系区,内部用 `---` 分左右两栏
- 不写 `<!-- contact -->` → 整个 slot 都是 bio
- 开始标签后直接 `<!-- contact -->` → 跳过 bio

::::

---

### Sites 网站卡片

::::tabs
tab: 演示效果

:::sites{group="design"}
:::

tab: 示例代码

`````markdown
:::sites{group="design"}
:::
`````

- `group`（**必填**）：对应 `site-config.ts` 中 `links` 配置的分组名
- 数据在 `site-config.ts` 的 `links` 字段中配置
- 支持封面图、图标、标题、描述和彩色标签
- 封面图未指定时自动通过截图服务抓取（默认 `thumio`，可在 `site-config.ts` 中切换为 `mshots`）

::::

---

### Posters 海报

::::tabs
tab: 演示效果

**竖向比例（默认）**

:::posters{group="movies" cols="6"}
:::

**正方形比例**

:::posters{group="albums" ratio="square"}
:::

tab: 示例代码

**竖向比例**

`````markdown
:::posters{group="movies" cols="6"}
:::
`````

**正方形比例**

`````markdown
:::posters{group="albums" ratio="square"}
:::
`````

- `group`（**必填**）：对应 `site-config.ts` 中 `links` 配置的分组名
- `ratio`：比例，可选 `portrait`（竖向 2:3，默认）或 `square`（正方形 1:1）
- `cols`：固定列数，可选 `2` / `3` / `4` / `5` / `6` / `8`，不传则自动填充
- 海报卡片使用 `cover` 或 `icon` 字段作为封面图
- 鼠标悬停时显示标题文字
- 极小间隙的紧凑网格布局

::::
