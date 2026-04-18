<div align="center">

# Vergil

一个系统化设计的 Astro 个人网站主题 — 视图系统、标签体系、智能助理、插件架构，不只是模板，而是一套可扩展的建站框架。

Vergil 基于 [Dante](https://github.com/JustGoodUI/dante-astro-theme) 极简主题进行了大量定制化和本地化改造，名字致敬但丁的老对手，也代表了这个项目从极简出发、走向体系化的方向。

[![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/wsjz/vergil-astro-theme?style=social)](https://github.com/wsjz/vergil-astro-theme)
[![GitHub issues](https://img.shields.io/github/issues/wsjz/vergil-astro-theme)](https://github.com/wsjz/vergil-astro-theme/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/wsjz/vergil-astro-theme/pulls)

[快速开始](#快速开始) · [核心系统](#核心系统) · [未来规划](#未来规划) · [参与贡献](#参与贡献)

</div>

---

## 核心系统

### 视图系统

Vergil 不是单一布局的主题，而是一套多视图架构。每个视图拥有独立的布局、导航和页面结构，通过配置自由切换，这是目前提供的内置视图：

- **默认视图** — 完整的博客/作品集体验，侧边栏导航、精选文章、瀑布流相册
- **沉浸阅读** — 极简阅读模式，去除干扰，专注内容
- **简历模式** — 结构化简历展示，独立布局

视图在 `site-config.ts` 中声明，框架自动生成对应路由和布局。扩展新视图只需添加 Layout + Pages，无需改动核心代码。

### 标签体系

多维度的内容组织系统，不只是简单的标签列表：

- **标签 (Tags)** — 细粒度的关键词标记，支持聚合页和筛选
- **分类 (Categories)** — 内容的大类归属
- **专栏 (Series)** — 有序的系列文章，带上下篇导航
- **文档目录 (Docs)** — 层级化的知识库，侧边栏树形导航

四种维度可以自由组合，同一篇文章可以同时属于某个分类、打上多个标签、归入某个专栏。其中标签体系和文档系统的设计灵感源于 [Hexo Stellar](https://github.com/xaoxuu/hexo-theme-stellar) 的标签组件与 Wiki 系统。

### 智能助理

内置站点助理系统，支持两种动画引擎，通过 Provider 模式切换，未来希望能真正实现网站管家的能力：

- **Rive** — 高性能矢量动画，适合轻量交互角色
- **Live2D** — 2D 角色模型，适合拟人化助理形象

配置即启用，无需额外开发。

### 插件架构

自定义 Remark/Rehype 插件体系，扩展 Markdown 的表达能力：

- 自定义指令语法、终端风格代码块、标题增强
- Shiki 代码标注 — diff、行高亮、词高亮

## 更多特性

- **深色模式** — 亮色/暗色主题无缝切换
- **全文搜索** — 基于 Fuse.js 的客户端搜索
- **评论系统** — 支持 Giscus 和 Artalk，配置即用
- **RSS 订阅** — 自动生成 Feed
- **SEO** — Sitemap、OG 卡片
- **自定义字体** — 字体注册表机制，声明式配置
- **响应式** — 桌面端和移动端适配

## 快速开始

```bash
# 克隆项目
git clone https://github.com/wsjz/vergil-astro-theme.git
cd vergil-astro-theme

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

跑起来之后，编辑 `src/data/site-config.ts` 配置你的站点信息，在 `src/content/` 下写 Markdown 就能开始创作。

## 未来规划

Vergil 还在持续演进中，按优先级排列：

**近期 — 视图与架构扩展**
- **更多视图** — Wiki 模式、时间线模式等
- **教程视图** — 面向教学场景的步进式内容体验，支持章节导航、阅读进度和顺序引导
- **富媒体标签** — 扩展 Markdown 标签能力，支持视频、音频、图片画廊、嵌入卡片等媒体类型，增强内容表达力
- **组件插槽** — 让用户在不 fork 的情况下注入自定义组件

**中期 — 智能化与基础设施**
- **智能化** — AI 驱动的内容推荐、智能摘要、站点助理对话能力
- **国际化 (i18n)** — 多语言内容和界面支持
- **无障碍 (a11y)** — 更完善的可访问性支持
- **CLI 工具** — 一键初始化、内容脚手架

**远期 — 生态探索**
- **主题市场** — 可切换的视觉风格包
- **社交平台接入** — 一键同步发布到多个平台，写一次、到处发
- **Web3 探索** — 去中心化身份、链上内容存证等方向的实验性集成

## 参与贡献

Vergil 目前由个人在业余时间维护，想法很多，但一个人的精力终归有限。很多方向我想做但还没来得及做，也有些领域我并不擅长。

如果你觉得这个项目有意思，欢迎以任何方式参与进来 — 不一定要写代码，提个 Bug、聊一个想法、改一句文档、翻译一段界面文字，都是实实在在的贡献。开源项目最好的样子，就是每个人带着自己擅长的东西来，一起把它变得更好。

如果你想提交代码：

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-idea`
3. 提交修改：`git commit -m 'feat: your feature'`
4. 推送并提交 Pull Request

提交信息建议遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范（`feat:` / `fix:` / `docs:` 等）。

## 致谢

- [Dante](https://github.com/JustGoodUI/dante-astro-theme) — Vergil 的起点，一个优雅的 Astro 极简主题
- [Hexo Stellar](https://github.com/xaoxuu/hexo-theme-stellar) — 标签体系与文档系统的设计灵感来源
- [Astro](https://astro.build) — 让静态站点开发重新变得有趣

## License

[MIT](LICENSE)
