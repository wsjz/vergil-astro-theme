---
title: 页面创建
order: 1
---

# 页面创建

页面是一种独立的内容形式，不隶属于博客、项目或其他分类，适合创建"关于我"、联系方式等独立页面。

## 文件位置

页面存放在 `src/content/pages/` 目录下，使用 Markdown 格式（`.md`）。

## 文件格式

```markdown
---
title: 关于我
---

你好，我是张三，一名前端开发者...

## 联系方式

- 邮箱：zhangsan@example.com
- GitHub：[github.com/zhangsan](https://github.com/zhangsan)
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 页面标题 |

## 页面路径

页面的访问路径由文件名决定：

| 文件名 | 访问路径 |
|--------|---------|
| `about.md` | `/about` |
| `contact.md` | `/contact` |
| `terms.md` | `/terms` |

## 常用页面建议

- **关于我（about.md）** — 介绍你自己
- **联系方式（contact.md）** — 邮箱、社交媒体等
- **友链（links.md）** — 推荐的其他博客
- **版权声明（terms.md）** — 内容使用协议

## 简历页面

除了普通页面，Vergil 还内置了简历视图，用于展示在线履历。

### 文件位置

`src/content/resume/index.md`

### 格式示例

```markdown
---
title: 简历
name: 张三
avatar: ../../assets/images/avatar.jpg
contact:
  email: zhangsan@example.com
  phone: 138****8888
  location: 北京
  website: https://example.com
---

## 个人简介

5 年前端开发经验...

## 工作经历

### 某某公司 — 高级前端工程师

2022.03 - 至今

- 负责核心产品前端架构
- 带领 5 人团队完成重构

## 技能

- React / Vue / TypeScript
- Node.js / Python
```

### 访问路径

`/views/resume/`

### 打印为 PDF

简历视图已针对打印优化，按 `Ctrl+P`（或 `Cmd+P`）即可打印为 PDF。

## 在导航中添加页面

创建页面后，可以在 `src/data/site-config.ts` 的导航配置中添加入口，让读者能够找到这个页面。
