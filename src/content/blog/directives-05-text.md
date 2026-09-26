---
title: 文字与交互指令
excerpt: 高亮、删除线、上下标、键盘键、标签、按钮、复选框、表情。大多是行内指令，写在句子中间。
publishDate: 'Aug 21 2026'
tags:
  - 使用指南
categories: ["博客相关"]
series: 内容指令示例
---

这一类大多是行内指令，用单个冒号写在句子中间，不打断段落。

---
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

### Hashtag 标签

::::tabs
tab: 演示效果

- 自动轮询颜色：:hashtag[Astro]{href="/tags/前端"} :hashtag[博客]{href="/tags/博客搭建"} :hashtag[教程]{href="/tags/使用指南"} :hashtag[前端]{href="/tags/前端"} :hashtag[CSS]{href="/tags/设计"}
- 自定义颜色：:hashtag[指定蓝色]{href="/tags/后端" color="blue"} :hashtag[指定红色]{href="/tags/架构" color="red"}

 tab: 示例代码

 ````
 - 自动轮询颜色：:hashtag[Astro]{href="/tags/前端"} :hashtag[博客]{href="/tags/博客搭建"} :hashtag[教程]{href="/tags/使用指南"} :hashtag[前端]{href="/tags/前端"} :hashtag[CSS]{href="/tags/设计"}
 - 自定义颜色：:hashtag[指定蓝色]{href="/tags/后端" color="blue"} :hashtag[指定红色]{href="/tags/架构" color="red"}
 ````

 - `:hashtag` 默认自动轮询 7 种颜色（红、橙、黄、绿、青、蓝、紫），无需指定 `color`
 - `:hashtag` 的 `href` 为跳转链接，`color` 可手动自定义颜色
 - `:hashtag` 左侧会自动显示 `#` 图标

::::

---

### Button 按钮

::::tabs
tab: 演示效果

- 普通按钮：:button[查看文档]{href="/" color="accent"} :button[GitHub]{href="/" color="blue"}
- 带图标的按钮：:button[搜索]{href="/archives" color="green" icon="lucide:search"}
- 小尺寸按钮：:button[标签]{href="/tags" color="purple" size="xs"}
- 图标按钮组：:button[文档]{href="/docs" color="cyan" icon="lucide:book-open"} :button[源码]{href="https://github.com/wsjz/vergil-astro-theme" color="cyan" icon="lucide:code"} :button[示例]{href="/albums" color="cyan" icon="lucide:trophy"}

 tab: 示例代码

 ````
 - 普通按钮：:button[查看文档]{href="/" color="accent"} :button[GitHub]{href="/" color="blue"}
 - 带图标的按钮：:button[搜索]{href="/archives" color="green" icon="lucide:search"}
 - 小尺寸按钮：:button[标签]{href="/tags" color="purple" size="xs"}
 - 图标按钮组：:button[文档]{href="/docs" color="cyan" icon="lucide:book-open"} :button[源码]{href="https://github.com/wsjz/vergil-astro-theme" color="cyan" icon="lucide:code-2"} :button[示例]{href="/albums" color="cyan" icon="lucide:trophy"}
 ````

 - `:button` 的 `href` 为跳转链接，`color` 可自定义颜色
 - `:button` 支持 `icon` 属性，可传入 Iconify 图标名（如 `lucide:search`）或图片 URL
 - `:button` 支持 `size="xs"` 小尺寸模式

::::

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

---

### Checkbox 复选框

::::tabs
 tab: 演示效果

:checkbox[默认未选中]
:checkbox[已选中]{checked="true"}
:checkbox[绿色已选中]{checked="true" color="green"}
:checkbox[紫色加号]{checked="true" color="purple" symbol="plus"}
:checkbox[红色减号]{checked="true" color="red" symbol="minus"}
:checkbox[青色叉号]{checked="true" color="cyan" symbol="times"}

行内用法：:checkbox[行内复选框]{inline="true" checked="true"}

 tab: 示例代码

`````markdown
:checkbox[默认未选中]
:checkbox[已选中]{checked="true"}
:checkbox[绿色已选中]{checked="true" color="green"}
:checkbox[紫色加号]{checked="true" color="purple" symbol="plus"}
:checkbox[红色减号]{checked="true" color="red" symbol="minus"}
:checkbox[青色叉号]{checked="true" color="cyan" symbol="times"}

行内用法：:checkbox[行内复选框]{inline="true" checked="true"}
`````

- 默认独占一行（块级），添加 `inline="true"` 可在段落中内联使用
- `:checkbox` 的 `checked` 为 `true` 时显示选中态
- `:checkbox` 的 `symbol` 可选值：`plus`、`minus`、`times`
- `color` 支持 `blue`、`green`、`red`、`cyan`、`purple`、`orange` 等或任意色值

::::

---

### Radio 单选按钮

::::tabs
 tab: 演示效果

:radio[单选未选中]
:radio[单选已选中]{checked="true"}
:radio[单选橙色]{checked="true" color="orange"}

行内用法：:radio[行内单选]{inline="true" checked="true"}

 tab: 示例代码

 `````markdown
 :radio[单选未选中]
 :radio[单选已选中]{checked="true"}
 :radio[单选橙色]{checked="true" color="orange"}

 行内用法：:radio[行内单选]{inline="true" checked="true"}
 `````

 - 默认独占一行（块级），添加 `inline="true"` 可在段落中内联使用
 - `:radio` 的 `checked` 为 `true` 时显示选中态
 - `color` 支持 `blue`、`green`、`red`、`cyan`、`purple`、`orange` 等或任意色值

 ::::

 ---

 ### GHCard GitHub 卡片

 ::::tabs
 tab: 演示效果

 :::ghcard{type="repo" repo="withastro/astro"}
 :::

 :::ghcard{type="user" user="octocat" bio="For all time, always."}
 :::
 
 :::ghcard{type="user" user="octocat" avatar="false"}
 :::
 
 tab: 示例代码
 
 `````markdown
 :::ghcard{type="repo" repo="withastro/astro"}
 :::
 
 :::ghcard{type="user" user="octocat" bio="For all time, always."}
 :::
 
 :::ghcard{type="user" user="octocat" avatar="false"}
 :::
 `````
 
  - `type`：`repo`（仓库卡片）或 `user`（用户卡片）
  - `repo`：仓库全名，格式为 `owner/repo`（`type="repo"` 时必填）
  - `user`：GitHub 用户名（`type="user"` 时必填）
  - `bio`：自定义用户简介（可选，仅 `user` 类型有效）
  - `avatar`：`false` 可隐藏用户头像（可选，仅 `user` 类型有效）
  - 数据通过 GitHub API 动态获取，自定义 `bio` 会在加载前作为占位展示

::::

---

#### 在右侧边栏中使用 GHCard

除了正文，你也可以通过 `GhCard` 组件把卡片放到页面右侧边栏。在 Astro 页面（如 `src/pages/blog/[id].astro`）中，向 `BaseLayout` 的 `right-sidebar` slot 传入组件即可：

`````astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import GhCard from '../../components/widgets/GhCard.astro';
---

<BaseLayout ...>
  <div slot="right-sidebar" class="p-4 pt-6">
    <GhCard mode="repo" repo="withastro/astro" />
    <GhCard mode="user" user="octocat" bio="For all time, always." avatar={false} />
  </div>
  <!-- 文章正文 -->
</BaseLayout>
`````

`GhCard` 组件属性：

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mode` | `'repo' \| 'user'` | 是 | 卡片类型 |
| `repo` | `string` | mode=repo | 仓库全名 `owner/repo` |
| `user` | `string` | mode=user | GitHub 用户名 |
| `bio` | `string` | 否 | 用户简介（仅 user） |
| `avatar` | `boolean` | 否 | 是否显示头像，默认 `true`（仅 user） |

> 由于数据通过客户端 JS 获取，放在边栏也会自动填充 GitHub API 数据。

---

### Emoji 表情包

::::tabs
 tab: 演示效果

今天是开心的一天 :emoji[aini]{source="qq"}，代码终于跑通了！:emoji[OK]{source="qq"}

Twemoji 风格的表情 :emoji[1f600]{source="twemoji"} :emoji[1f389]{source="twemoji"}

贴吧表情 :emoji[huaji]{source="tieba"} :emoji[bishi]{source="tieba"}

Blobcat 表情 :emoji[0_0]{source="blobcat"}

也可以直接使用默认源（省略 source）：:emoji[aini]

自定义高度：:emoji[party]{source="blobcat" height="3em"}

 tab: 示例代码

 `````markdown
今天是开心的一天 :emoji[aini]{source="qq"}，代码终于跑通了！:emoji[OK]{source="qq"}

Twemoji 风格的表情 :emoji[1f600]{source="twemoji"} :emoji[1f389]{source="twemoji"}

贴吧表情 :emoji[huaji]{source="tieba"} :emoji[bishi]{source="tieba"}

Blobcat 表情 :emoji[0_0]{source="blobcat"}

也可以直接使用默认源（省略 source）：:emoji[aini]

自定义高度：:emoji[party]{source="blobcat" height="3em"}
 `````

 - `:emoji` 为行内指令，可在段落中直接使用
 - `source` 表情源，可选值：
   - `qq` — QQ 表情（GIF 格式）
   - `twemoji` — Twitter Emoji（SVG 格式）
   - `aru` — Aru 表情（GIF 格式）
   - `tieba` — 贴吧表情（PNG 格式）
   - `blobcat` — Blobcat 表情（GIF 格式）
   - `default` — 默认表情源（与 qq 相同）
   - 省略 `source` 时自动使用 `default` 源
 - `height` 自定义表情高度，默认 `1.75em`
 - 方括号内的内容为表情名称，会替换到 URL 中的 `{name}` 占位符

::::

---
