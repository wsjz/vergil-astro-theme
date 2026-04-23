---
title: RSS 订阅
order: 3
---

# RSS 订阅

Vergil 自动生成 RSS Feed，方便读者通过 RSS 阅读器订阅你的博客更新。

## 订阅地址

RSS 订阅地址默认为：

```
https://你的域名/rss.xml
```

## 包含内容

RSS Feed 会自动包含：
- 博客文章（按发布时间倒序）
- 文章标题和摘要
- 发布日期和作者

## 如何订阅

读者可以将 RSS 地址添加到任意 RSS 阅读器中：

- [Feedly](https://feedly.com/)
- [Inoreader](https://www.inoreader.com/)
- [Reeder](https://reederapp.com/)（macOS/iOS）
- [Fluent Reader](https://hyliu.me/fluent-reader/)（Windows）

## 在网站上展示 RSS 入口

建议在网站底部导航或关于页面中添加 RSS 订阅入口，方便读者发现：

```markdown
[订阅 RSS](/rss.xml)
```

## 无需额外配置

RSS 功能是自动生成的，无需手动配置。只要博客文章存放在 `src/content/blog/` 目录下，系统会自动更新 RSS Feed。
