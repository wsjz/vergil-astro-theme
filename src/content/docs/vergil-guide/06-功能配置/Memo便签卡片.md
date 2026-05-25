---
title: Memo 便签卡片
order: 5
---

# Memo 便签卡片

Memo 是一个通用的便签卡片组件，用来展示欢迎语、重要通知、自我介绍等富文本内容。你可以创建任意数量的 Memo 卡片，每张卡片是一个独立的配置文件，按需放入右侧边栏。

## 核心设计

- **MemoCard** 是通用组件，一个实例只渲染**一张卡片**
- 配置文件名是**语义化的**（如 `welcome.ts`、`notice.ts`），表示这张卡片的内容主题
- 在 `sidebar.components` 中用任意 key 引用配置，在 `sidebar.right` 中通过 key 名控制显示和顺序

## 配置一张卡片

主题自带了两个示例配置：`welcome.ts`（欢迎卡片）和 `notice.ts`（通知卡片）。你可以直接修改它们，也可以创建自己的卡片。

以默认的欢迎卡片为例：

```typescript
// src/data/config/welcome.ts
import type { MemoItem } from '../../types';

export const welcome = {
    title: '欢迎来到 Vergil',
    paragraphs: ['这里是我的数字花园，记录技术思考、生活碎片与偶然的灵光一现。'],
    quote: '在这个信息爆炸的时代，我希望能留下一些真正值得被阅读的东西。',
    actions: [
        { text: '看看我写的文章', href: '/blog', icon: 'globe' },
        { text: '关于我', href: '/about', icon: 'message-circle' },
    ],
} satisfies MemoItem;
```

在 `features.ts` 中使用：

```typescript
// src/data/config/features.ts
import { welcome } from './welcome';

export const sidebar = {
    right: ['welcome', 'heatmap', 'featured', 'tags'],
    components: {
        welcome,     // ← key 名 "welcome" 就是右侧边栏的组件 ID
        recentPosts: { limit: 5 },
        featured: { limit: 3 },
        tags: { limit: 6 },
    },
};
```

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 否 | 卡片上方的灰色小标题 |
| `paragraphs` | `string[]` | 否 | 正文段落数组，每段一个 `<p>` |
| `quote` | `string` | 否 | 引用块文字，左侧带竖线 |
| `actions` | `MemoAction[]` | 否 | 底部操作按钮 |

### actions

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `text` | `string` | 是 | 按钮文字 |
| `href` | `string` | 是 | 链接地址 |
| `icon` | `string` | 否 | Lucide 图标名（kebab-case） |
| `external` | `boolean` | 否 | 是否在新标签页打开 |

## 配置多张卡片

想加第二张卡片？新建一个配置文件，再注册一次即可。

```typescript
// src/data/config/about.ts
import type { MemoItem } from '../../types';

export const about = {
    title: '关于我',
    paragraphs: ['一名热爱技术的开发者，喜欢探索新事物。'],
    actions: [
        { text: '了解更多', href: '/about', icon: 'info' },
    ],
} satisfies MemoItem;
```

```typescript
// src/data/config/features.ts
import { welcome } from './welcome';
import { about } from './about';

export const sidebar = {
    right: ['welcome', 'about', 'heatmap', 'featured', 'tags'],
    components: {
        welcome,
        about,
        recentPosts: { limit: 5 },
        featured: { limit: 3 },
        tags: { limit: 6 },
    },
};
```

这样右侧边栏会依次渲染：欢迎卡片 → 关于我卡片 → 热力图 → ...

`welcome` 和 `notice` 只是主题自带的两个示例，你可以重命名、删除或新增任意自己的卡片。key 名完全由你决定。

## 图标支持

`icon` 支持以下 Lucide 图标名（后续版本会扩展）：

- `globe` — 地球图标
- `message-circle` — 聊天气泡
- `info` — 信息图标
- `arrow-up-right` — 外部链接箭头

你也可以不配置 `icon`，按钮将只显示文字。

## 仅显示一段简单文字

如果你只需要一段欢迎语，可以精简为：

```typescript
// src/data/config/welcome.ts
import type { MemoItem } from '../../types';

export const welcome = {
    paragraphs: ['欢迎来到我的博客，这里记录技术、生活与思考。'],
} satisfies MemoItem;
```

## 注意事项

- 所有字段都是可选的，但至少配一个字段卡片才有内容
- `actions` 中的链接支持相对路径（如 `/contact`）和绝对路径（如 `https://...`）
- `external: true` 会自动添加 `target="_blank"` 和 `rel="noopener noreferrer"`
- 从 `sidebar.right` 数组中删除对应的 ID 即可隐藏该卡片
- 配置文件名和 `components` 中的 key 名建议保持一致，方便维护
