<div align="center">

# Vergil

面向创作者的 Astro 建站框架 — 写 Markdown 就能搭建功能丰富的个人网站。 具有多视图架构、多主题相册、多维标签体系、内容指令扩展等丰富的个性化功能。

Vergil 基于 [Dante](https://github.com/JustGoodUI/dante-astro-theme) 极简主题进行了大量定制化和本地化改造。名字致敬但丁的老对手，也代表了这个项目从极简出发、走向体系化的方向。

[![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/wsjz/vergil-astro-theme?style=social)](https://github.com/wsjz/vergil-astro-theme)

[快速开始](#快速开始) · [核心系统](#核心系统) · [内容指令](#内容指令) · [生态工具](#生态工具) · [参与贡献](#参与贡献)

</div>

---

## 效果展示

<div align="center">

![首页](/public/readme/3.jpg)
![文章页 Banner](/public/readme/1.jpg)
![文档目录](/public/readme/2.jpg)

</div>

## 核心系统

### 视图系统

Vergil 不是单一布局的主题，而是一套多视图架构。每个视图拥有独立的布局、导航和页面结构，通过配置自由切换：

- **默认视图** — 完整的博客/作品集体验，侧边栏导航、精选文章、瀑布流相册
- **沉浸阅读** — 极简阅读模式，去除干扰，专注内容
- **简历模式** — 结构化简历展示，独立布局

### 标签体系

多维度的内容组织系统，灵感源于 [Hexo Stellar](https://github.com/xaoxuu/hexo-theme-stellar)：

- **标签 (Tags)** — 细粒度的关键词标记，支持聚合页和筛选
- **分类 (Categories)** — 内容的大类归属
- **专栏 (Series)** — 有序的系列文章，带上下篇导航
- **文档目录 (Docs)** — 层级化的知识库，侧边栏树形导航

四种维度可以自由组合。

### 内容指令

通过自定义 Remark/Rehype 插件扩展 Markdown 语法，在普通的 `.md` 文件中直接用 `:::` / `:` 指令，无需 MDX。

你可以在文章中插入提示块、选项卡、时间线、友链卡片、GitHub 卡片、视频/音频播放器、加密内容块等 30 余种组件。例如：

```markdown
:::callout{type="tip"}
这是一条小技巧，读者一眼就能注意到。
:::

:::tabs
tab: 效果
（这里放内容）

tab: 代码
（这里放代码）
:::

:::video{bilibili="BV1xx411c7mD"}
:::
```

> 完整指令列表和用法详见 [内容指令演示](/blog/markdown-directives-demo/)。

### 相册系统

专为摄影作品设计的展示系统：

- **Golden 主题** — 深色背景 + 金色点缀，适合艺术/商业摄影
- **Seasons 主题** — 四季主题，支持季节过滤、诗歌卡片、时间控制台、粒子动画
- **布局切换** — grid / masonry / timeline / carousel
- **照片适配** — cover / contain / auto 三种填充模式
- **Lightbox** — 点击放大，键盘/手势导航
- **EXIF 展示** — 相机型号、焦距、光圈、快门、ISO

### 图文动态

轻量级短内容发布，独立于博客：

- 纯 Markdown 编写，支持标签
- 按时间流展示，适合日常想法、读书摘抄、技术随笔


### 侧边栏系统

高度可配置的侧边栏组件：

- **左侧栏** — 最近文章、站点信息
- **右侧栏** — 欢迎语、内容热力图、精选文章、标签云、GitHub 卡片
- **文章页右侧** — 目录、相关文章、精选推荐
- **文档页右侧** — 目录导航

## 更多特性

- **深色模式** — 亮色/暗色主题无缝切换
- **开屏页** — 全屏轮播背景、渐变遮罩、自定义导航按钮
- **全文搜索** — 基于 Fuse.js 的客户端搜索
- **评论系统** — Giscus / Artalk，配置即用
- **浮动音频播放器** — 全局背景音乐
- **RSS 订阅** — 自动生成 Feed
- **SEO** — Sitemap、OG 卡片
- **自定义字体** — 字体注册表机制，声明式配置
- **响应式** — 桌面端和移动端适配
- **站点助理** — 配置即启用，按页面路由定制对话台词，打字机效果、空闲自动触发、拖拽定位，支持Rive和Live2D

## 快速开始

> 需要 Node.js 18+

```bash
# 克隆项目
git clone https://github.com/wsjz/vergil-astro-theme.git
cd vergil-astro-theme

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 生态工具

Vergil 正在从单一主题扩展为一整套建站工具链：

### [vergil-writing-skills](https://github.com/vergil-astro/vergil-writing-skills)

AI 写作增强技能。安装后，告诉你的 AI 助手 "Enhance my article with Vergil directives"，它会自动分析文章类型和风格偏好，用 Vergil 的 30 多种内容指令（callout、tabs、timeline、grid 等）来优化排版和表达。

支持 Claude Code、Codex CLI、Cursor、Gemini CLI、OpenClaw。

### [vergil-cli](https://github.com/vergil-astro/vergil-cli)

命令行工具 `vg`，从终端管理整个 Vergil 站点：

- `vg init` — 一键初始化项目
- `vg new post "标题"` — 创建博客文章（支持 draft、tags、series、cover）
- `vg new album "标题" --theme seasons` — 创建相册
- `vg new thought "内容"` — 发布图文动态
- `vg publish` — 一键发布草稿
- `vg list` / `vg series` / `vg docs` — 内容管理和目录浏览
- `vg skill install` — 将写作技能安装到 AI 助手

然后编辑站点配置文件，在内容目录下写 Markdown 即可开始创作。

## 内容类型

Vergil 内置丰富的内容形态，创作者只需写 Markdown，其余交给主题：

- **博客文章** — 长文写作，支持标签、分类、专栏归属、Banner 头图、自定义字体
- **图文动态** — 短内容流，适合日常想法、读书摘抄、技术随笔，独立于博客
- **项目展示** — 作品集页面，展示项目描述、技术栈、链接
- **相册** — 摄影作品展示，支持 Golden/Seasons 双主题、季节过滤、EXIF 信息
- **文档** — 层级化知识库，带侧边栏树形导航，适合教程和 Wiki
- **简历** — 结构化个人简历，独立布局和样式
- **独立页面** — 关于、联系、条款等自定义页面

## 未来规划

- 文档完善，降低上手门槛
- 教程视图
- AI 驱动的内容推荐、智能摘要、站点助理对话能力
- 国际化 (i18n)
- 社交平台接入
- Web3 化探索

## 参与贡献

Vergil 由个人在业余时间维护。欢迎以任何方式参与 — 提 Bug、聊想法、改文档、翻译界面文字，都是贡献。

提交代码请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## 致谢

- [Dante](https://github.com/JustGoodUI/dante-astro-theme) — Vergil 的起点
- [Hexo Stellar](https://github.com/xaoxuu/hexo-theme-stellar) — 标签体系与文档系统的设计灵感
- [Astro](https://astro.build) — 让静态站点开发重新变得有趣

## License

[MIT](LICENSE)
