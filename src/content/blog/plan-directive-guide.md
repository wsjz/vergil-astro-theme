---
title: Plan 数据视图指令详解
excerpt: Plan 指令将 Markdown 表格转换为多视图数据展示组件，支持看板、列表、表格、时间轴、里程碑、进度六种视图。
publishDate: '2026-05-28'
tags:
  - 使用指南
categories: ["博客相关"]
---

## 核心概念

Plan 指令将 Markdown 表格数据渲染为可切换的多视图组件。表头支持 `name:type` 格式声明列类型，不写 `:type` 时默认 `text`。

## 列类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `text` | 默认纯文本 | 任意文字 |
| `status` | 状态圆点（`todo`/`doing`/`done`） | `done` |
| `priority` | 优先级标签（`P0`/`P1`/`P2`） | `P0` |
| `date` | 日期 | `2024-01-01` |
| `progress` | 进度条 | `65%` |
| `number` | 数字，自动千分位格式化，Notion 风格标签样式 | `4200` |
| `checkbox` | 勾选框（`true`/`false`） | `true` |
| `select` | 单选标签 | 任意文字 |
| `link` | 可点击链接 | `https://...` |

## 状态列详解

状态列使用 `status` 类型，支持三个值：

- `todo` — 待办，空心圆
- `doing` — 进行中，半实心圆 + 呼吸动画
- `done` — 已完成，实心圆

在看板视图中，状态列会自动识别并按 `todo → doing → done` 排序；在列表视图中会显示对应颜色的左侧竖条；在时间轴视图中会显示对应颜色的节点。

## 视图介绍

每个视图都支持搜索、筛选、排序。下面每个示例分成「演示效果」和「示例代码」两个选项卡，方便边预览边复制。

---

### Table 表格

通用视图，永远可渲染。支持搜索、筛选、排序。

::::tabs
tab: 演示效果

:::plan{views="table"}
| 书名:text | 作者:text | 评分:number | 已读:checkbox |
|-----------|-----------|-------------|---------------|
| 三体      | 刘慈欣    | 9           | true          |
| 活着      | 余华      | 9           | true          |
| 百年孤独  | 马尔克斯  | 8           | false         |
:::

tab: 示例代码

````markdown
:::plan{views="table"}
| 书名:text | 作者:text | 评分:number | 已读:checkbox |
|-----------|-----------|-------------|---------------|
| 三体      | 刘慈欣    | 9           | true          |
| 活着      | 余华      | 9           | true          |
| 百年孤独  | 马尔克斯  | 8           | false         |
:::
````

- `views="table"` 只启用表格视图
- `:number` 类型显示为千分位格式化的标签样式
- `:checkbox` 类型显示为实心/空心圆点

::::

---

### List 列表

紧凑的列表视图，适合快速浏览。状态列会显示左侧彩色竖条。

::::tabs
tab: 演示效果

:::plan{views="list" statusCol="状态"}
| 状态:status | 任务:text | 负责人:text |
|-------------|-----------|-------------|
| done        | 设计稿    | Alice       |
| doing       | 前端开发  | Bob         |
| todo        | 需求分析  | Carol       |
:::

tab: 示例代码

````markdown
:::plan{views="list" statusCol="状态"}
| 状态:status | 任务:text | 负责人:text |
|-------------|-----------|-------------|
| done        | 设计稿    | Alice       |
| doing       | 前端开发  | Bob         |
| todo        | 需求分析  | Carol       |
:::
````

- `statusCol="状态"` 指定状态列，列表左侧会显示彩色竖条
- 不指定 `statusCol` 则不显示竖条

::::

---

### Board 看板

按指定列分组展示卡片。如果 `groupBy` 指定了状态列，会按 `todo → doing → done` 固定顺序排列。

::::tabs
tab: 演示效果

:::plan{views="board" groupBy="状态" titleCol="任务"}
| 状态:status | 任务:text | 负责人:text |
|-------------|-----------|-------------|
| todo        | 设计稿    | Alice       |
| doing       | 前端开发  | Bob         |
| done        | 需求分析  | Carol       |
:::

tab: 示例代码

````markdown
:::plan{views="board" groupBy="状态" titleCol="任务"}
| 状态:status | 任务:text | 负责人:text |
|-------------|-----------|-------------|
| todo        | 设计稿    | Alice       |
| doing       | 前端开发  | Bob         |
| done        | 需求分析  | Carol       |
:::
````

- `groupBy="状态"` 按状态列分组
- `titleCol="任务"` 指定卡片标题列
- 不指定 `titleCol` 时默认使用第一列

::::

---

### Timeline 时间轴

时间轴视图支持单点模式（圆点）和范围模式（条）。超过一定时间跨度时自动调整刻度密度。

#### 单点模式（需要 `dateCol`）

::::tabs
tab: 演示效果

:::plan{views="timeline" dateCol="日期" statusCol="状态"}
| 事件:text | 日期:date | 状态:status |
|-----------|-----------|-------------|
| 项目启动  | 2024-01-01| todo        |
| 中期评审  | 2024-03-15| doing       |
| 正式上线  | 2024-06-01| done        |
:::

tab: 示例代码

````markdown
:::plan{views="timeline" dateCol="日期" statusCol="状态"}
| 事件:text | 日期:date | 状态:status |
|-----------|-----------|-------------|
| 项目启动  | 2024-01-01| todo        |
| 中期评审  | 2024-03-15| doing       |
| 正式上线  | 2024-06-01| done        |
:::
````

- `dateCol="日期"` 指定日期列，每个事件显示为一个圆点
- `statusCol="状态"` 让圆点显示对应颜色

::::

#### 范围模式（需要 `startDate` 和 `endDate`）

::::tabs
tab: 演示效果

:::plan{views="timeline" startDate="开始" endDate="结束" titleCol="任务"}
| 任务:text | 开始:date  | 结束:date  |
|-----------|------------|------------|
| 需求分析  | 2024-01-01 | 2024-01-15 |
| 前端开发  | 2024-02-01 | 2024-03-15 |
| 测试验收  | 2024-03-20 | 2024-04-10 |
:::

tab: 示例代码

````markdown
:::plan{views="timeline" startDate="开始" endDate="结束" titleCol="任务"}
| 任务:text | 开始:date  | 结束:date  |
|-----------|------------|------------|
| 需求分析  | 2024-01-01 | 2024-01-15 |
| 前端开发  | 2024-02-01 | 2024-03-15 |
| 测试验收  | 2024-03-20 | 2024-04-10 |
:::
````

- `startDate="开始"` + `endDate="结束"` 指定起始和结束列，渲染为甘特条
- 必须同时指定两个属性才会进入范围模式

::::

#### 单边范围（只写 `endDate`）

::::tabs
tab: 演示效果

:::plan{views="timeline" endDate="截止" titleCol="任务"}
| 任务:text | 截止:date  |
|-----------|------------|
| 年度报告  | 2024-12-31 |
| 季度汇报  | 2024-06-30 |
| 月度总结  | 2024-03-31 |
:::

tab: 示例代码

````markdown
:::plan{views="timeline" endDate="截止" titleCol="任务"}
| 任务:text | 截止:date  |
|-----------|------------|
| 年度报告  | 2024-12-31 |
| 季度汇报  | 2024-06-30 |
| 月度总结  | 2024-03-31 |
:::
````

- 只写 `endDate` 时，从最小日期开始到截止时间渲染条
- 截止时间处显示一个实心圆点

::::

---

### Milestone 里程碑

按时间顺序排列的里程碑视图，每个条目显示为一个带时间轴的卡片。

::::tabs
tab: 演示效果

:::plan{views="milestone" dateCol="日期" titleCol="里程碑" descCol="描述"}
| 里程碑:text | 日期:date  | 描述:text         |
|-------------|------------|-------------------|
| v1.0 发布   | 2024-01-01 | 首个正式版本      |
| v1.5 更新   | 2024-03-15 | 支持暗黑模式      |
| v2.0 重构   | 2024-06-01 | 全新架构上线      |
:::

tab: 示例代码

```markdown
:::plan{views="milestone" dateCol="日期" titleCol="里程碑" descCol="描述"}
| 里程碑:text | 日期:date  | 描述:text         |
|-------------|------------|-------------------|
| v1.0 发布   | 2024-01-01 | 首个正式版本      |
| v1.5 更新   | 2024-03-15 | 支持暗黑模式      |
| v2.0 重构   | 2024-06-01 | 全新架构上线      |
:::
```

- `dateCol="日期"` 指定日期列（必填）
- `titleCol="里程碑"` 指定标题列
- `descCol="描述"` 指定描述列，显示在卡片下方

::::

---

### Progress 进度

需要 `progressCol` 指定进度列。会显示环形完成度图、各任务进度条和统计分布。

::::tabs
tab: 演示效果

:::plan{views="progress" progressCol="完成度" statusCol="状态" titleCol="任务"}
| 任务:text | 完成度:progress | 状态:status |
|-----------|-----------------|-------------|
| 需求分析  | 100%            | done        |
| 技术选型  | 100%            | done        |
| 前端开发  | 65%             | doing       |
| 测试验收  | 0%              | todo        |
:::

tab: 示例代码

````markdown
:::plan{views="progress" progressCol="完成度" statusCol="状态" titleCol="任务"}
| 任务:text | 完成度:progress | 状态:status |
|-----------|-----------------|-------------|
| 需求分析  | 100%            | done        |
| 技术选型  | 100%            | done        |
| 前端开发  | 65%             | doing       |
| 测试验收  | 0%              | todo        |
:::
````

- `progressCol="完成度"` 指定进度列（必填）
- `statusCol` 提供状态分布统计
- 环形图显示整体完成度，下方显示各任务进度条

::::

---

### 多视图组合

::::tabs
tab: 演示效果

:::plan{title="项目开发计划" views="board,table,timeline,progress" default="board" dateCol="截止日期" progressCol="完成度" statusCol="状态" titleCol="任务"}
| 状态:status | 任务:text | 优先级:priority | 截止日期:date | 负责人:text | 完成度:progress |
|-------------|-----------|-----------------|---------------|-------------|-----------------|
| done        | 需求分析  | P0              | 2024-01-01    | Alice       | 100%            |
| done        | 技术选型  | P1              | 2024-01-10    | Bob         | 100%            |
| doing       | 前端开发  | P0              | 2024-02-01    | Carol       | 65%             |
| todo        | 测试验收  | P0              | 2024-03-10    | Dave        | 0%              |
:::

tab: 示例代码

````markdown
:::plan{title="项目开发计划" views="board,table,timeline,progress"
        default="board" dateCol="截止日期" progressCol="完成度"
        statusCol="状态" titleCol="任务"}
| 状态:status | 任务:text | 优先级:priority | 截止日期:date | 负责人:text | 完成度:progress |
|-------------|-----------|-----------------|---------------|-------------|-----------------|
| done        | 需求分析  | P0              | 2024-01-01    | Alice       | 100%            |
| done        | 技术选型  | P1              | 2024-01-10    | Bob         | 100%            |
| doing       | 前端开发  | P0              | 2024-02-01    | Carol       | 65%             |
| todo        | 测试验收  | P0              | 2024-03-10    | Dave        | 0%              |
:::
````

- `views="board,table,timeline,progress"` 启用四个视图
- `default="board"` 默认显示看板视图
- 多个列映射同时存在，数据在所有视图中复用

::::

---

## 场景模板

### 学习笔记

记录学习进度，用 progress 视图看整体完成度。

::::tabs
tab: 演示效果

:::plan{title="前端进阶学习" views="list,table,progress" default="list" progressCol="进度" statusCol="状态" titleCol="课程"}
| 状态:status | 课程:text | 进度:progress | 备注:text |
|-------------|-----------|---------------|-----------|
| done        | TypeScript 基础 | 100% | 泛型还需巩固 |
| doing       | React 进阶      | 60%  | Hooks 源码学习中 |
| todo        | Next.js 实战    | 0%   | 待安排时间 |
| todo        | 性能优化专题    | 0%   | 待安排时间 |
:::

tab: 示例代码

````markdown
:::plan{title="前端进阶学习" views="list,table,progress"
        default="list" progressCol="进度" statusCol="状态" titleCol="课程"}
| 状态:status | 课程:text | 进度:progress | 备注:text |
|-------------|-----------|---------------|-----------|
| done        | TypeScript 基础 | 100% | 泛型还需巩固 |
| doing       | React 进阶      | 60%  | Hooks 源码学习中 |
| todo        | Next.js 实战    | 0%   | 待安排时间 |
| todo        | 性能优化专题    | 0%   | 待安排时间 |
:::
````

::::

---

### 阅读计划

::::tabs
tab: 演示效果

:::plan{title="2024 阅读计划" views="board,table,milestone" default="board" groupBy="类别" dateCol="读完日期" titleCol="书名"}
| 类别:select | 书名:text | 作者:text | 读完日期:date | 评分:number |
|-------------|-----------|-----------|---------------|-------------|
| 科幻        | 三体      | 刘慈欣    | 2024-02-15    | 9           |
| 文学        | 活着      | 余华      | 2024-03-10    | 9           |
| 科幻        | 沙丘      | 赫伯特    | 2024-05-20    | 8           |
| 历史        | 万历十五年 | 黄仁宇   |               |             |
| 文学        | 百年孤独  | 马尔克斯  |               |             |
:::

tab: 示例代码

````markdown
:::plan{title="2024 阅读计划" views="board,table,milestone"
        default="board" groupBy="类别" dateCol="读完日期" titleCol="书名"}
| 类别:select | 书名:text | 作者:text | 读完日期:date | 评分:number |
|-------------|-----------|-----------|---------------|-------------|
| 科幻        | 三体      | 刘慈欣    | 2024-02-15    | 9           |
| 文学        | 活着      | 余华      | 2024-03-10    | 9           |
| 科幻        | 沙丘      | 赫伯特    | 2024-05-20    | 8           |
| 历史        | 万历十五年 | 黄仁宇   |               |             |
| 文学        | 百年孤独  | 马尔克斯  |               |             |
:::
````

::::

---

### 旅行安排

::::tabs
tab: 演示效果

:::plan{title="云南之行" views="timeline,milestone" default="timeline" dateCol="日期" statusCol="状态" titleCol="事件"}
| 事件:text | 日期:date | 状态:status | 备注:text |
|-----------|-----------|-------------|-----------|
| 抵达昆明  | 2024-07-01| done        | 入住翠湖附近 |
| 大理古城  | 2024-07-03| done        | 骑行洱海西线 |
| 丽江古城  | 2024-07-06| doing       | 玉龙雪山一日游 |
| 香格里拉  | 2024-07-09| todo        | 普达措国家公园 |
| 返程      | 2024-07-12| todo        | 昆明飞回     |
:::

tab: 示例代码

```markdown
:::plan{title="云南之行" views="timeline,milestone"
        default="timeline" dateCol="日期" statusCol="状态" titleCol="事件"}
| 事件:text | 日期:date | 状态:status | 备注:text |
|-----------|-----------|-------------|-----------|
| 抵达昆明  | 2024-07-01| done        | 入住翠湖附近 |
| 大理古城  | 2024-07-03| done        | 骑行洱海西线 |
| 丽江古城  | 2024-07-06| doing       | 玉龙雪山一日游 |
| 香格里拉  | 2024-07-09| todo        | 普达措国家公园 |
| 返程      | 2024-07-12| todo        | 昆明飞回     |
:::
```

::::

---

### 健身打卡

::::tabs
tab: 演示效果

:::plan{title="健身计划" views="list,progress" default="list" progressCol="本周完成" statusCol="状态" titleCol="项目"}
| 状态:status | 项目:text | 目标:number | 本周完成:progress | 单位:select |
|-------------|-----------|-------------|-------------------|-------------|
| doing       | 跑步      | 5           | 60%               | 次/周       |
| doing       | 力量训练  | 3           | 66%               | 次/周       |
| todo        | 游泳      | 2           | 0%                | 次/周       |
| done        | 瑜伽      | 2           | 100%              | 次/周       |
:::

tab: 示例代码

````markdown
:::plan{title="健身计划" views="list,progress" default="list"
        progressCol="本周完成" statusCol="状态" titleCol="项目"}
| 状态:status | 项目:text | 目标:number | 本周完成:progress | 单位:select |
|-------------|-----------|-------------|-------------------|-------------|
| doing       | 跑步      | 5           | 60%               | 次/周       |
| doing       | 力量训练  | 3           | 66%               | 次/周       |
| todo        | 游泳      | 2           | 0%                | 次/周       |
| done        | 瑜伽      | 2           | 100%              | 次/周       |
:::
````

::::

---

### 习惯追踪

::::tabs
tab: 演示效果

:::plan{title="每日习惯" views="table"}
| 习惯:text | 周一:checkbox | 周二:checkbox | 周三:checkbox | 周四:checkbox | 周五:checkbox | 周六:checkbox | 周日:checkbox |
|-----------|---------------|---------------|---------------|---------------|---------------|---------------|---------------|
| 早起      | true          | true          | false         | true          | true          | false         | false         |
| 阅读      | true          | true          | true          | true          | false         | true          | true          |
| 运动      | true          | false         | true          | false         | true          | true          | false         |
| 冥想      | false         | true          | true          | true          | true          | false         | true          |
:::

tab: 示例代码

````markdown
:::plan{title="每日习惯" views="table"}
| 习惯:text | 周一:checkbox | 周二:checkbox | 周三:checkbox | 周四:checkbox | 周五:checkbox | 周六:checkbox | 周日:checkbox |
|-----------|---------------|---------------|---------------|---------------|---------------|---------------|---------------|
| 早起      | true          | true          | false         | true          | true          | false         | false         |
| 阅读      | true          | true          | true          | true          | false         | true          | true          |
| 运动      | true          | false         | true          | false         | true          | true          | false         |
| 冥想      | false         | true          | true          | true          | true          | false         | true          |
:::
````

- 纯 checkbox 表格，类似打卡表
- `:checkbox` 类型显示为实心/空心圆点

::::

---

### 年度目标

::::tabs
tab: 演示效果

:::plan{title="2024 OKR" views="board,progress" default="board" groupBy="状态" titleCol="关键结果" progressCol="完成度" statusCol="状态" priorityCol="优先级"}
| 状态:status | 目标:text | 关键结果:text | 完成度:progress | 优先级:priority |
|-------------|-----------|---------------|-----------------|-----------------|
| doing       | 技术成长  | 掌握 TypeScript | 60%             | P0              |
| doing       | 技术成长  | 阅读 12 本技术书 | 25%             | P1              |
| todo        | 身体健康  | 减重 5kg        | 0%              | P0              |
| done        | 身体健康  | 每周运动 3 次   | 100%            | P0              |
| todo        | 财务规划  | 建立应急基金    | 0%              | P1              |
:::

tab: 示例代码

````markdown
:::plan{title="2024 OKR" views="board,progress" default="board"
        groupBy="状态" titleCol="关键结果" progressCol="完成度"
        statusCol="状态" priorityCol="优先级"}
| 状态:status | 目标:text | 关键结果:text | 完成度:progress | 优先级:priority |
|-------------|-----------|---------------|-----------------|-----------------|
| doing       | 技术成长  | 掌握 TypeScript | 60%             | P0              |
| doing       | 技术成长  | 阅读 12 本技术书 | 25%             | P1              |
| todo        | 身体健康  | 减重 5kg        | 0%              | P0              |
| done        | 身体健康  | 每周运动 3 次   | 100%            | P0              |
| todo        | 财务规划  | 建立应急基金    | 0%              | P1              |
:::
````

::::

---

## 属性参考

| 属性 | 说明 | 示例 |
|------|------|------|
| `title` | 组件标题 | `title="项目计划"` |
| `views` | 启用的视图 | `views="board,table"` |
| `default` | 默认视图 | `default="table"` |
| `groupBy` | board 分组列 | `groupBy="状态"` |
| `filters` | table 筛选列 | `filters="状态,优先级"` |
| `dateCol` | 日期列映射 | `dateCol="截止日期"` |
| `startDate` | 范围起始列 | `startDate="开始"` |
| `endDate` | 范围结束列 | `endDate="结束"` |
| `progressCol` | 进度列映射 | `progressCol="完成度"` |
| `statusCol` | 状态列映射 | `statusCol="状态"` |
| `titleCol` | 标题列映射 | `titleCol="任务"` |
| `ownerCol` | 负责人列映射 | `ownerCol="负责人"` |
| `priorityCol` | 优先级列映射 | `priorityCol="优先级"` |
| `descCol` | 描述列映射 | `descCol="描述"` |

## 视图所需列

| 视图 | 所需列 | 说明 |
|------|--------|------|
| table | 无 | 永远可渲染 |
| list | 无 | 永远可渲染 |
| board | 无 | 永远可渲染 |
| timeline | `dateCol` 或 `startDate` 或 `endDate` | 单点或范围模式 |
| milestone | `dateCol` | 只支持单点模式 |
| progress | `progressCol` | 必须指定进度列 |
