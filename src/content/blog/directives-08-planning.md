---
title: 时间规划指令
excerpt: 倒计时、OKR、日历、任务计划。把进度和排期直接写进文章里。
publishDate: 'Aug 27 2026'
tags:
  - 使用指南
categories: ["博客相关"]
series: 内容指令示例
---

把时间和进度写进文章。这四个指令的数据都用表格描述，改起来和改普通表格一样。

---
### Deadline 倒计时

::::tabs
tab: 演示效果

:::deadline{date="2026-12-31" title="年度目标截止" description="保持节奏，稳步推进"}
:::

:::deadline{date="2025-01-01" title="已过期示例" expiredText="活动已结束" description="保持节奏，稳步推进" showSeconds="false"}
:::

tab: 示例代码

````markdown
:::deadline{date="2026-12-31" title="年度目标截止" description="保持节奏，稳步推进"}
:::

:::deadline{date="2025-01-01" title="已过期示例" expiredText="活动已结束" description="保持节奏，稳步推进" showSeconds="false"}
:::
````

- `date`（**必填**）：目标日期，格式 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm`
- `title`：倒计时标题
- `description`：描述文字
- `showSeconds`：是否显示秒数，默认 `true`
- `expiredText`：过期后显示的文案，默认 `已截止`

::::

---

### OKR 目标管理

::::tabs
tab: 演示效果

:::okr{title="Vergil 主题 2026 Q2" period="2026 第二季度"}

## 提升主题易用性与覆盖度

易用性与覆盖度

| key result | target | current | desc | status | link |
| ---------- | ------ | ------- | ---- | ------ | ---- |
| 新增 5 个 Markdown 内容指令 | 5 | 2 | 当前已实现 plan、okr，待完成 calendar 和 timeline 视图 | 正常 | |
| 文档站点覆盖全部指令用法 | 30 | 18 | 每个指令需包含语法说明、示例代码、效果演示 | 风险 | https://github.com/wsjz/vergil-astro-theme/issues |
| 零配置启动体验优化 | 1 | 0 | 简化主题初始化流程，降低新用户上手门槛 | 滞后 | |

## 扩大社区影响力

社区影响力

| key result | target | current | desc | status | link |
| ---------- | ------ | ------- | ---- | ------ | ---- |
| GitHub Stars 突破 500 | 500 | 320 | 通过技术博客和社交媒体持续推广 | 正常 | |
| 发布 3 篇主题使用教程 | 3 | 1 | 覆盖安装、自定义、部署全流程 | 正常 | https://github.com/wsjz/vergil-astro-theme/discussions |
| 收集并处理 20 条用户反馈 | 20 | 12 | 在 GitHub Issues 中追踪和响应 | 正常 | |

:::

tab: 示例代码

````markdown
:::okr{title="Vergil 主题 2026 Q2" period="2026 第二季度"}

## 提升主题易用性与覆盖度

易用性与覆盖度

| key result | target | current | desc | status | link |
| ---------- | ------ | ------- | ---- | ------ | ---- |
| 新增 5 个 Markdown 内容指令 | 5 | 2 | 当前已实现 plan、okr... | 正常 | |
| 文档站点覆盖全部指令用法 | 30 | 18 | 每个指令需包含语法说明... | 风险 | https://github.com/... |
| 零配置启动体验优化 | 1 | 0 | 简化主题初始化流程... | 滞后 | |

## 扩大社区影响力

社区影响力

| key result | target | current | desc | status | link |
| ---------- | ------ | ------- | ---- | ------ | ---- |
| GitHub Stars 突破 500 | 500 | 320 | 通过技术博客和社交媒体推广 | 正常 | |
| 发布 3 篇主题使用教程 | 3 | 1 | 覆盖安装、自定义、部署全流程 | 正常 | https://github.com/... |
| 收集并处理 20 条用户反馈 | 20 | 12 | 在 GitHub Issues 中追踪和响应 | 正常 | |

:::
````

- 使用 `##` 标题定义 **Objective（目标）**
- 每个 O 下方用 Markdown **表格**定义 **Key Results（关键结果）**
- 表格列：`key result`（名称）、`target`（目标值）、`current`（当前值）
- 可选列：`desc`（详细说明）、`status`（状态：正常/风险/滞后/完成）、`link`（链接，带链接的 KR 整行可点击）
- 支持 `title` 和 `period` 属性设置 OKR 标题与周期
- 自动计算每个 KR、每个 O 以及**整体完成度**并渲染进度条

::::

---

### Calendar 日历

基于农历和法定节假日数据生成的高仿 macOS 日历组件，支持自定义事件、农历、节气、节假日、调休等信息。支持前后月份切换和「今天」快捷跳转。

::::tabs
tab: 演示效果

:::calendar{month="2026-05"}

| date | type | content | color | link |
| ---- | ---- | ------- | ----- | ---- |
| 05-01 | 假期 | 五一假期开始 | red | |
| 05-05 | 工作 | 补班调休 | | |
| 05-20 | 生活 | 朋友聚会 | blue | |
| 05-25 | 项目 | Vergil v1.0 发布 | green | https://github.com/wsjz/vergil-astro-theme |

:::

tab: 示例代码

````markdown
:::calendar{month="2026-05"}

| date | type | content | color | link |
| ---- | ---- | ------- | ----- | ---- |
| 05-01 | 假期 | 五一假期开始 | red | |
| 05-05 | 工作 | 补班调休 | | |
| 05-20 | 生活 | 朋友聚会 | blue | |
| 05-25 | 项目 | Vergil v1.0 发布 | green | https://github.com/wsjz/vergil-astro-theme |

:::
````

- `month`：指定月份，格式 `YYYY-MM`。不传则默认当前月份
- 表格列（全部可选）：
  - `date`：事件日期，支持 `MM-DD`、`YYYY-MM-DD` 或 `D`（当月）
  - `type`：事件类型，相同类型自动分配同一种颜色
  - `content`：事件文字内容
  - `color`：指定颜色（`blue`、`green`、`red`、`purple`、`yellow`、`cyan`、`orange`、`pink`）
  - `link`：可选链接，带链接的日程显示小箭头图标，点击可跳转
- 自动功能（无需配置）：
  - 农历日期（初一至三十）
  - 二十四节气（立春、雨水、惊蛰…）
  - 法定节假日（春节、国庆等，含连续休假日横条）
  - 调休补班标记（橙色「班」标签）
  - 传统节日（儿童节、建党节等）

::::

---

### Plan 任务计划

多视图数据指令，支持看板、列表、表格、时间轴、里程碑、进度、艾宾浩斯复习七种视图。数据通过 Markdown 表格输入，构建时静态渲染，视图切换使用纯 CSS `:target`。

表头支持 `name:type` 格式声明列类型，不写 `:type` 时默认为 `text`。

::::tabs
tab: 演示效果

:::plan{title="项目开发计划" views="board,list,table,timeline,milestone,progress" default="board" filters="状态,优先级,负责人"}

| 状态:status | 任务:text | 优先级:priority | 截止日期:date | 负责人:text | 完成度:progress |
|-------------|-----------|-----------------|---------------|-------------|-----------------|
| done        | 需求分析  | P0              | 2024-01-01    | Alice       | 100%            |
| done        | 技术选型  | P1              | 2024-01-10    | Bob         | 100%            |
| doing       | 前端开发  | P0              | 2024-02-01    | Carol       | 65%             |
| todo        | 测试验收  | P0              | 2024-03-10    | Dave        | 0%              |

:::

tab: 示例代码

````markdown
:::plan{title="项目开发计划" views="board,list,table,timeline,milestone,progress" default="board" filters="状态,优先级,负责人"}

| 状态:status | 任务:text | 优先级:priority | 截止日期:date | 负责人:text | 完成度:progress |
|-------------|-----------|-----------------|---------------|-------------|-----------------|
| done        | 需求分析  | P0              | 2024-01-01    | Alice       | 100%            |
| done        | 技术选型  | P1              | 2024-01-10    | Bob         | 100%            |
| doing       | 前端开发  | P0              | 2024-02-01    | Carol       | 65%             |
| todo        | 测试验收  | P0              | 2024-03-10    | Dave        | 0%              |

:::
````

- `title`：顶部标题
- `views`：启用的视图，逗号分隔。默认 `board,list,table,timeline,milestone,progress,ebbinghaus`
- `default`：默认显示的视图
- `filters`：Table 视图的筛选列，逗号分隔（如 `filters="状态,优先级"`）。不写则无筛选下拉，仅保留搜索框。写 `filters="none"` 显式关闭筛选

**列类型**：表头用 `name:type` 格式，支持的类型有 `text`、`status`、`priority`、`date`、`progress`、`number`（千分位格式化，Notion 风格标签）、`checkbox`、`select`、`link`。不写 `:type` 时默认 `text`。

**列映射属性**：
- `dateCol` — timeline/milestone 使用的日期列
- `startDate` / `endDate` — timeline 范围模式，指定后渲染为时间条
- `progressCol` — progress 视图使用的进度列
- `statusCol` — board/list/timeline 使用的状态列
- `titleCol` — 指定标题列
- `ownerCol` — board/list/milestone 使用的负责人列
- `priorityCol` — board/list/milestone/progress 使用的优先级列
- `descCol` — milestone 使用的描述列

**视图所需列**：

| 视图 | 所需列 | 说明 |
|------|--------|------|
| table | 无 | 永远可渲染 |
| list | 无 | 永远可渲染 |
| board | 无 | 永远可渲染，默认按第一列分组 |
| timeline | `dateCol` 或 `startDate` 或 `endDate` | 单点模式显示圆点，范围模式显示条 |
| milestone | `dateCol` | 只支持单点模式 |
| progress | `progressCol` | 必须显式指定进度列 |
| ebbinghaus | `dateCol` | 艾宾浩斯复习计划，自动计算复习节点 |

::::
