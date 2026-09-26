---
title: 图表可视化指令
excerpt: Mermaid 流程图和 ECharts 数据图表。写几行文本描述，构建时渲染成图。
publishDate: 'Aug 23 2026'
tags:
  - 使用指南
categories: ["博客相关"]
series: 内容指令示例
---

两种图表引擎。Mermaid 适合流程和关系，ECharts 适合数据。都是写文本，构建时出图。

---
### Mermaid 流程图

::::tabs

tab: 演示效果

:::mermaid
flowchart TD
    A[用户访问] --> B{是否登录}
    B -->|是| C[进入首页]
    B -->|否| D[跳转登录页]
    C --> E[浏览文章]
    D --> F[输入账号密码]
    F --> G[验证成功]
    G --> C
:::

tab: 示例代码

````markdown
:::mermaid
flowchart TD
    A[用户访问] --> B{是否登录}
    B -->|是| C[进入首页]
    B -->|否| D[跳转登录页]
    C --> E[浏览文章]
    D --> F[输入账号密码]
    F --> G[验证成功]
    G --> C
:::
````

- 支持 Mermaid 所有图表类型：flowchart、sequenceDiagram、gantt、classDiagram 等

::::

---

### ECharts 数据图表

::::tabs

tab: 演示效果

:::echart
{
  "title": { "text": "月度访问量", "left": "center" },
  "tooltip": { "trigger": "axis" },
  "xAxis": {
    "type": "category",
    "data": ["1月", "2月", "3月", "4月", "5月", "6月"]
  },
  "yAxis": { "type": "value" },
  "series": [{
    "data": [820, 932, 901, 934, 1290, 1330],
    "type": "line",
    "smooth": true,
    "areaStyle": {}
  }]
}
:::

:::echart
{
  "title": { "text": "用户来源分布", "left": "center" },
  "tooltip": { "trigger": "item" },
  "series": [{
    "type": "pie",
    "radius": "50%",
    "data": [
      { "value": 1048, "name": "搜索引擎" },
      { "value": 735, "name": "直接访问" },
      { "value": 580, "name": "邮件营销" },
      { "value": 484, "name": "联盟广告" },
      { "value": 300, "name": "视频广告" }
    ]
  }]
}
:::

tab: 示例代码

````markdown
:::echart
{
  "title": { "text": "月度访问量", "left": "center" },
  "tooltip": { "trigger": "axis" },
  "xAxis": {
    "type": "category",
    "data": ["1月", "2月", "3月", "4月", "5月", "6月"]
  },
  "yAxis": { "type": "value" },
  "series": [{
    "data": [820, 932, 901, 934, 1290, 1330],
    "type": "line",
    "smooth": true,
    "areaStyle": {}
  }]
}
:::

:::echart
{
  "title": { "text": "用户来源分布", "left": "center" },
  "tooltip": { "trigger": "item" },
  "series": [{
    "type": "pie",
    "radius": "50%",
    "data": [
      { "value": 1048, "name": "搜索引擎" },
      { "value": 735, "name": "直接访问" },
      { "value": 580, "name": "邮件营销" },
      { "value": 484, "name": "联盟广告" },
      { "value": 300, "name": "视频广告" }
    ]
  }]
}
:::
````

- 内容需为**合法 JSON**，作为 ECharts 的 `setOption` 配置
- 支持 `height` 属性自定义高度，如 `:::echart{height="300px"}`，默认 `400px`
- 支持 ECharts 所有图表类型：line、bar、pie、scatter、radar 等

::::
