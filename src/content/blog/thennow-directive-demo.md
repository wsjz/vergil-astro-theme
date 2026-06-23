---
title: thennow 图片对比指令演示
description: 展示 :::thennow 前后对比滑块效果
publishDate: 2026-06-23
tags: [directive, demo]
---

# thennow 图片对比指令

`:::thennow` 用于在文章中展示两张图片的拖拽对比。

## 基础用法

:::thennow
![改造前](https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80)
![改造后](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80)
:::

## 自定义标签

:::thennow{before="装修前" after="装修后"}
![装修前](https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80)
![装修后](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80)
:::

## 错误回退（只有一张图）

:::thennow
![只有一张](https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80)
:::
