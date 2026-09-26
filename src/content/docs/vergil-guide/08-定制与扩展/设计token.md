---
title: 设计 Token
order: 1
---

# 设计 Token

圆角、阴影、层级、动效时长都有统一的标度，定义在 `src/styles/base/tokens.css`。写组件时从这里挑值，不要另造。

## 为什么要有这个

没有标度之前，主题里的圆角出现过 2、3、4、5、6、7、8、10、12、24px 十种写法，z-index 从 1 一路写到 10000。结果是两个相邻的卡片圆角差 2px 没人发现，新加一个浮层不知道该写多大的 z-index，只能往上加一个 9 试试。

有了标度之后，挑值变成从固定的几档里选，而不是凭感觉写数字。

## 圆角

| Token | 值 | 用在哪 |
| --- | --- | --- |
| `--radius-xs` | 2px | 焦点环、小标记 |
| `--radius-sm` | 4px | 标签、徽章 |
| `--radius-md` | 8px | 按钮、输入框 |
| `--radius-lg` | 12px | 小卡片 |
| `--radius-xl` | 16px | 卡片 |
| `--radius-2xl` | 24px | 大卡片、弹窗 |
| `--radius-full` | 9999px | 胶囊、圆形 |

这些同时桥接给了 Tailwind，所以 `rounded-md`、`rounded-2xl` 这类工具类直接可用，和 CSS 里的 `var(--radius-md)` 是同一个值。

## 阴影

| Token | 用在哪 |
| --- | --- |
| `--shadow-xs` | 几乎贴地，用于分隔 |
| `--shadow-sm` | 卡片静止态 |
| `--shadow-md` | 卡片悬停、下拉菜单 |
| `--shadow-lg` | 浮层、侧边抽屉 |
| `--shadow-xl` | 弹窗、灯箱 |

层级越高抬得越远。同一个元素在静止和悬停两个状态之间，通常相差一档（`sm` → `md`），跨两档以上会显得夸张。

## 动效时长

| Token | 值 | 用在哪 |
| --- | --- | --- |
| `--duration-fast` | 150ms | 悬停变色、小图标 |
| `--duration-base` | 200ms | 卡片抬升、展开收起 |
| `--duration-slow` | 300ms | 页面转场、弹窗 |

另有 `--ease-out` 作为默认缓动曲线。

## 层级

0 到 9 留给组件内部的局部堆叠，不用登记。跨组件的层级从下面挑：

| Token | 值 | 用在哪 |
| --- | --- | --- |
| `--z-raised` | 10 | 局部抬起，如热力图格子悬停 |
| `--z-sticky` | 30 | 吸顶工具栏 |
| `--z-sidebar` | 40 | 侧边栏、遮罩 |
| `--z-floating` | 50 | 回到顶部、浮动播放器 |
| `--z-panel` | 60 | 目录面板、阅读进度条 |
| `--z-overlay` | 100 | 站点助理 |
| `--z-modal` | 200 | 画中画视频、跳过导航链接 |
| `--z-lightbox` | 300 | 图片灯箱 |

```css
/* 不要这样 */
.my-popup { z-index: 9999; }

/* 这样 */
.my-popup { z-index: var(--z-panel); }
```

## 颜色

颜色不在 `tokens.css` 里，在 `src/styles/base/theme.css`。那里定义了 11 套配色方案，每套有亮暗两份，各 12 个语义变量：

```
--text-main / --text-secondary / --text-muted
--bg-main / --bg-card / --bg-muted / --bg-hover
--border-main / --border-light
--accent-color / --accent-hover
```

写组件时用语义变量或对应的 Tailwind 类（`text-main`、`bg-card`、`border-light`），不要写死颜色值，否则切换配色方案时你的组件不会跟着变。

:::callout{type="warn" title="border-main 不是浅色"}
名字容易误导：`--border-main` 在亮色方案下接近黑色，是用于强调的深色描边；日常的浅灰分隔线是 `--border-light`。

曾经文档页的上下篇导航误用了 `border-main` 配虚线，结果分割线又黑又虚，和站内其他地方完全不是一个东西。
:::

## 已知的小问题

`tokens.css` 末尾的 `@theme inline` 块会产生和 `:root` 同名的变量定义，最终靠源码顺序让 `:root` 的真实值生效。功能正常，但这是巧合而非设计。后续会改成不依赖顺序的写法。如果你调整了 `global.css` 里的 `@import` 顺序，注意验证圆角和阴影是否还正常。
