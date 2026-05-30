---
title: "Mind Directive 演示"
publishDate: '2026-05-30'
tags:
  - 演示
categories: ["功能演示"]
---

# Mind 思维导图指令

将 Markdown 嵌套无序列表渲染为交互式 SVG 思维导图。支持缩放、拖拽、展开/折叠。

---

## 基础用法

::::tabs
tab: 演示效果

:::mind
- Vergil 主题设计
  - 视觉系统
    - 配色方案
    - 字体层级
    - 间距规范
  - 交互系统
    - 纯 CSS 视图切换
    - 数据驱动渲染
    - 悬停动画效果
  - 指令生态
    - :::plan 多视图计划
    - :::timeline 时间轴
    - :::story 分镜脚本
:::

tab: 示例代码

`````markdown
:::mind
- Vergil 主题设计
  - 视觉系统
    - 配色方案
    - 字体层级
    - 间距规范
  - 交互系统
    - 纯 CSS 视图切换
    - 数据驱动渲染
    - 悬停动画效果
  - 指令生态
    - :::plan 多视图计划
    - :::timeline 时间轴
    - :::story 分镜脚本
:::
`````

- 使用 Markdown 嵌套无序列表定义层级结构
- 支持行内样式（粗体、斜体、代码等）
- 鼠标滚轮缩放，拖拽平移，点击节点折叠/展开

:::

---

## 技术栈示例

::::tabs
tab: 演示效果

:::mind
- 前端技术栈
  - 构建工具
    - Vite
    - Webpack
    - Rollup
  - 框架
    - React
    - Vue
    - Svelte
  - 样式
    - Tailwind CSS
    - Sass
    - CSS Modules
:::

tab: 示例代码

`````markdown
:::mind
- 前端技术栈
  - 构建工具
    - Vite
    - Webpack
    - Rollup
  - 框架
    - React
    - Vue
    - Svelte
  - 样式
    - Tailwind CSS
    - Sass
    - CSS Modules
:::
`````

::::
