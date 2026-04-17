---
title: 重新设计博客的字体系统
excerpt: 从混乱到克制——记录一次以「易读、护眼、有个性」为目标的字体系统重构，以及它如何与内容标签体系协同工作。
publishDate: 'Apr 16 2026'
isFeatured: true
tags:
  - 设计
  - 博客搭建
  - 使用指南
fonts:
  display: maokenZhuyuanTi
  body: monoFonts
---

:::note{title="TL;DR" color="green"}
这次更新把页面标题从 `text-5xl` 统一收敛到 `text-2xl/text-3xl`，正文标题层级保持 Minor Third 比例但不再随屏幕放大，blockquote 去掉斜体改用正常字重。整体目标是：**易读、护眼、有一点个性**。
:::

:::title{el="h2" centered="true" style="quote" color="rgb(255, 87, 36)"}
为什么要改
:::

之前每次打开文章页，我自己都觉得标题「太吵」。

页面级标题用到了 `sm:text-5xl`，在 15px 的正文衬托下像是一块巨大的广告牌。不同页面的标题尺寸也不统一：文章页 `5xl`、列表页 `4xl`、相册页 `3xl`——这种跳跃让整个站点的阅读节奏变得支离破碎。

另外，正文里的 `blockquote` 用了大字号斜体，中文内容在衬线斜体下可读性很差，反而成了视觉噪音。

## 设计原则

:::callout{type="tip" title="核心目标"}
- **易读**：字号、行高、对比度优先服务长文阅读。
- **护眼**：避免极端的字重和过大的字号跳跃，减少视觉疲劳。
- **有个性**：用衬线字体（Newsreader Variable）承担标题和装饰性文字，与无衬线正文形成材质对比。
:::

## 四个字体角色

我借鉴了市面上比较成熟的字体系统方案，把全站字体划分为四个角色：

| 角色 | 变量名 | 字体 | 用途 |
|------|--------|------|------|
| 展示 | `--font-display` | Newsreader Variable | 页面标题、装饰性标题 |
| 正文 | `--font-body` | Inter Variable | 长文阅读 |
| 界面 | `--font-ui` | Inter Variable | 导航、按钮、标签、元数据 |
| 代码 | `--font-mono` | JetBrains Mono / Cascadia Code | 代码块与行内代码 |

这种分离让不同场景下都能找到最合适的字形：正文追求清晰中性，标题保留一点衬线气质，代码则必须等宽。

 --- 


## Type Scale：Minor Third 的克制用法

基准字号定在 **15px**（`0.9375rem`），这是 Linear、Vercel、Notion 等产品的常见选择——足够大以提升可读性，又不会像 16px 基准那样导致中文长文页面过「散」。

层级比例使用 Minor Third（×1.2），但做了关键限制：

- **xs**：11.6px — 时间戳、角标
- **sm**：13.3px — 辅助说明
- **base**：15px — 正文基准
- **md**：16px — 稍大正文 / h4
- **lg**：18px — h3
- **xl**：21.6px — h2
- **2xl**：25.9px — h1（文章内）
- **3xl**：31px — 页面级标题上限

之前我在 `sm:` 断点下把正文标题又放大了一档（h1 到 31px），这次我**取消了这种断点放大**。标题在移动端和大屏上保持同一套尺寸，只通过容器宽度和留白来调整节奏，而不是靠字号膨胀来「撑场面」。

## 具体做了哪些调整

### 1. 页面标题全面收敛

所有页面级 h1 统一为：

- 移动端 `text-2xl`
- 大屏 `sm:text-3xl`

涉及页面包括：文章页、项目页、关于页、相册页、通用页面。列表页（Blog、Projects、Archives、标签、分类、专栏）则从 `sm:text-4xl` 降到了 `sm:text-2xl`，用更克制的体量来衬托列表内容本身。

### 2. 正文标题层级压缩边距

prose 内的 h1~h4 上外边距和底边距都收了一点：

- h1：`mt-8 mb-3` → `mt-8 mb-3`（本身就不大）
- h2：`mt-9 mb-2.5 pb-0.75` → `mt-7 mb-2 pb-1`
- h3：`mt-7.5 mb-2` → `mt-6 mb-1.5`
- h4：`mt-6 mb-1` → `mt-5 mb-1`

这样长文中标题与段落之间的「呼吸感」更均匀，不会出现某一级标题把内容扯得太开。

### 3. 引用块去斜体、缩小字号

中文环境下，衬线斜体并不是一个友好的选择。我把 blockquote 改为：

- `font-style: normal`
- `font-weight: 500`
- 字号从 `1.2em/1.4em` 降到统一的 `1.05em`
- 上下边距从 `1.875rem` 降到 `1.5rem`

现在的引用块更像是一段被「轻声读出」的正文，而不是一幅海报。

## 与标签系统的结合

这次字体系统重构本身也可以被标签系统所描述和组织。在写这篇文章时，我可以直接在 Markdown 中用内容指令标签来关联相关主题：

- :hashtag[设计]{href="/tags/设计" color="purple"}
- :hashtag[博客搭建]{href="/tags/博客搭建" color="blue"}
- :hashtag[使用指南]{href="/tags/使用指南" color="green"}

这些标签不仅是装饰，它们会真实地链接到对应的标签聚合页。这意味着：

1. **文章自带分类语义**：读者看完字体系统介绍，可以直接点击标签找到更多「设计」或「博客搭建」相关内容。
2. **标签页反哺内容发现**：标签聚合页会因为这篇文章而获得一篇新的、高质量的相关内容。
3. **写作体验一致**：我不需要在 Markdown 里手写 HTML 链接，用 `:hashtag[]` 指令就能保持视觉和交互的统一。

## 下一步

字体系统是一个需要长期观察的活体。接下来我会重点观察：

- 长文（3000 字以上）在 15px 基准下的疲劳度
- 代码块 13px 在移动端是否过小
- 中英文混排时 Inter + Newsreader 的协调性

:::quot
好的字体系统应该像空气一样——你感受不到它的存在，但离开它就无法呼吸。
:::

## Title 标签新样式

:::title{el="h2" centered="true" style="badge" color="red" shadow="true"}
OKR-2026
:::

:::title{el="h2" centered="true" style="quote" color="red"}
Vergil 是迄今为止最好看的主题
:::

:::title{el="h2" centered="true" style="quote" color="red" prefix="https://api.iconify.design/line-md:moon-alt-to-sunny-outline-loop-transition.svg" suffix="https://api.iconify.design/solar:list-heart-minimalistic-line-duotone.svg"}
这是一个 url 的示例
:::

:::title{el="h2" centered="true" style="badge" color="orange" shadow="true"}
热门话题
:::

:::title{el="h3" centered="true" style="quote" color="purple" shadow="true"}
不同层级的引用标题
:::

:::title{el="h4" centered="true" style="badge" color="green" shadow="true"}
Badge 小标题
:::

:::title{el="h2" centered="true" style="quote" shadow="true"}
默认 quote 不加 color
:::

:::title{el="h2" centered="true" style="badge" color="rgb(255, 87, 36)" shadow="true"}
粉色徽章
:::

