---
title: 内容展示指令
excerpt: 提示框、高亮块、引用卡片、段落引号、一键复制、私密内容。用来强调和保护正文里的关键信息。
publishDate: 'Aug 15 2026'
tags:
  - 使用指南
categories: ["博客相关"]
series: 内容指令示例
---

这一篇是用来突出正文信息的指令：提示、引用、折叠保护。同样按「演示效果 / 示例代码」两栏对照。

---
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

### Blockquote 段落引用

::::tabs
tab: 演示效果

:::blockquote
这是使用 blockquote 标签的例子。

支持多段落内容，适合引用长段文字。
:::

tab: 示例代码

````
:::blockquote
这是使用 blockquote 标签的例子。

支持多段落内容，适合引用长段文字。
:::
````

- 使用 `<blockquote>` 标签包裹内容
- 顶部左右角自动显示引号图标

::::

---

### Private 私密内容

将敏感内容放入加密容器，读者需要输入正确密码才能查看。支持密码提示，支持重新锁定。

#### 场景 1：加密文本内容

::::tabs
tab: 演示效果

:::private{password="hello2024" hint="打招呼 + 年份"}
这是加密的内容，只有知道密码的人才能看到。

- 敏感信息 1
- 敏感信息 2

**注意：** 请勿泄露密码！
:::

tab: 示例代码

`````markdown
:::private{password="hello2024" hint="打招呼 + 年份"}
这是加密的内容，只有知道密码的人才能看到。

- 敏感信息 1
- 敏感信息 2
:::
`````

- `password`（**必填**）：解密密码
- `hint`（可选）：密码提示，帮助读者回忆
- 支持段落、列表、代码块等任意 Markdown 内容
- 解密后显示 **重新锁定** 按钮，可再次隐藏

::::

---

#### 场景 2：加密代码片段

::::tabs
tab: 演示效果

:::private{password="123456"}
```env
DATABASE_URL=postgresql://user:secret@localhost:5432/db
API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET=my-super-secret-key
```
:::

tab: 示例代码

`````markdown
:::private{password="123456"}
```env
DATABASE_URL=postgresql://user:secret@localhost:5432/db
API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```
:::
`````

::::
