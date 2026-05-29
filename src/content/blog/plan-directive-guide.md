---
title: Plan 数据视图指令详解
excerpt: Plan 指令将 Markdown 表格转换为多视图数据展示组件，支持看板、列表、表格、时间轴、里程碑、进度、艾宾浩斯复习七种视图。
publishDate: '2026-05-28'
tags:
  - 使用指南
categories: ["博客相关"]
---

## 核心概念

Plan 指令将 Markdown 表格数据渲染为可切换的多视图组件。表头支持 `name:type` 格式声明列类型，不写 `:type` 时默认 `text`。

下面每个场景都分成「演示效果」和「示例代码」两个选项卡，你可以直接复制代码使用。

---

## 场景一：项目开发计划（多视图组合）

最完整的用法，同时启用看板、表格、时间轴、进度四个视图，数据在所有视图中复用。

::::tabs
tab: 演示效果

:::plan{title="项目开发计划" views="board,list,table,timeline,progress" default="board" dateCol="截止日期" progressCol="完成度" statusCol="状态" titleCol="任务" ownerCol="负责人" filters="状态,优先级"}
| 状态:status | 任务:text | 优先级:priority | 截止日期:date | 负责人:text | 完成度:progress |
|-------------|-----------|-----------------|---------------|-------------|-----------------|
| done        | 需求分析  | P0              | 2024-01-01    | Alice       | 100%            |
| done        | 技术选型  | P1              | 2024-01-10    | Bob         | 100%            |
| doing       | 前端开发  | P0              | 2024-02-01    | Carol       | 65%             |
| todo        | 测试验收  | P0              | 2024-03-10    | Dave        | 0%              |
:::

tab: 示例代码

````markdown
:::plan{title="项目开发计划" views="board,list,table,timeline,progress"
        default="board" dateCol="截止日期" progressCol="完成度"
        statusCol="状态" titleCol="任务" ownerCol="负责人"
        filters="状态,优先级"}
| 状态:status | 任务:text | 优先级:priority | 截止日期:date | 负责人:text | 完成度:progress |
|-------------|-----------|-----------------|---------------|-------------|-----------------|
| done        | 需求分析  | P0              | 2024-01-01    | Alice       | 100%            |
| done        | 技术选型  | P1              | 2024-01-10    | Bob         | 100%            |
| doing       | 前端开发  | P0              | 2024-02-01    | Carol       | 65%             |
| todo        | 测试验收  | P0              | 2024-03-10    | Dave        | 0%              |
:::
````

**用到的特性：**
- `views="board,list,table,timeline,progress"` 启用五个视图
- `default="board"` 默认显示看板视图
- `filters="状态,优先级"` 表格视图启用筛选下拉
- `ownerCol="负责人"` 看板卡片和列表条目显示负责人
- `:status` 列在**列表视图**显示彩色竖条，在**时间轴视图**显示不同颜色的节点
- `:priority` 列显示 P0/P1/P2 优先级标签
- `:date` 列在时间轴中定位圆点，表格中带月份色条
- `:progress` 列在进度视图中显示环形完成度和进度条
- `titleCol="任务"` 指定卡片/列表/里程碑标题列

::::

---

## 场景二：英语学习计划（艾宾浩斯复习）

基于艾宾浩斯遗忘曲线自动生成复习计划，鼠标悬停节点查看复习详情。

::::tabs
tab: 演示效果

:::plan{title="英语学习计划" views="ebbinghaus,table,board" default="ebbinghaus" dateCol="学习日期" titleCol="内容" groupBy="状态" statusCol="状态"}
| 内容:text | 学习日期:date | 复习重点:text | 预计时长:number | 状态:status |
|-----------|---------------|---------------|-----------------|-------------|
| 单词 List 1 | 2026-05-20    | 熟词僻义 + 例句 | 30分钟 | done        |
| 单词 List 2 | 2026-05-25    | 词根词缀整理    | 25分钟 | doing       |
| 高数导数   | 2026-05-27    | 复合函数求导    | 45分钟 | todo        |
:::

tab: 示例代码

````markdown
:::plan{title="英语学习计划" views="ebbinghaus,table,board"
        default="ebbinghaus" dateCol="学习日期" titleCol="内容"
        groupBy="状态" statusCol="状态"}
| 内容:text | 学习日期:date | 复习重点:text | 预计时长:number | 状态:status |
|-----------|---------------|---------------|-----------------|-------------|
| 单词 List 1 | 2026-05-20    | 熟词僻义 + 例句 | 30分钟 | done        |
| 单词 List 2 | 2026-05-25    | 词根词缀整理    | 25分钟 | doing       |
| 高数导数   | 2026-05-27    | 复合函数求导    | 45分钟 | todo        |
:::
````

**用到的特性：**
- `views="ebbinghaus,table,board"` 艾宾浩斯 + 表格 + 看板
- `dateCol="学习日期"` 指定学习日期，自动计算 6 个复习节点（+1天、+2天、+4天、+7天、+15天、+30天）
- `steps="1,3,7,14,30,60,90"` 可自定义复习间隔（默认不指定即可）
- 节点状态：实心 = 已完成，呼吸动画 + 下箭头 = 今天该复习，空心 = 待复习
- **鼠标悬停节点自动显示表格中其他列的内容**（如"复习重点"、"预计时长"）
- 右侧百分比表示已完成复习节点占比

::::

---

## 场景三：阅读书单（看板 + 里程碑）

按类别分组的阅读计划，结合看板和里程碑两个视图。

::::tabs
tab: 演示效果

:::plan{title="2024 阅读计划" views="board,table,milestone" default="board" groupBy="类别" dateCol="读完日期" titleCol="书名"}
| 类别:select | 书名:text | 作者:text | 读完日期:date | 评分:number | 链接:link |
|-------------|-----------|-----------|---------------|-------------|-----------|
| 科幻        | 三体      | 刘慈欣    | 2024-02-15    | 9           | [三体](https://book.douban.com/subject/2567698) |
| 文学        | 活着      | 余华      | 2024-03-10    | 9           | [活着](https://book.douban.com/subject/4913064) |
| 科幻        | 沙丘      | 赫伯特    | 2024-05-20    | 8           | [沙丘](https://book.douban.com/subject/26715448) |
| 历史        | 万历十五年 | 黄仁宇   |               |             | book.douban.com |
| 文学        | 百年孤独  | 马尔克斯  |               |             | https://book.douban.com/subject/ |
:::

tab: 示例代码

````markdown
:::plan{title="2024 阅读计划" views="board,table,milestone"
        default="board" groupBy="类别" dateCol="读完日期" titleCol="书名"}
| 类别:select | 书名:text | 作者:text | 读完日期:date | 评分:number | 链接:link |
|-------------|-----------|-----------|---------------|-------------|-----------|
| 科幻        | 三体      | 刘慈欣    | 2024-02-15    | 9           | [豆瓣](https://book.douban.com/subject/2567698) |
| 文学        | 活着      | 余华      | 2024-03-10    | 9           | [豆瓣](https://book.douban.com/subject/4913064) |
| 科幻        | 沙丘      | 赫伯特    | 2024-05-20    | 8           | [豆瓣](https://book.douban.com/subject/26715448) |
| 历史        | 万历十五年 | 黄仁宇   |               |             | |
| 文学        | 百年孤独  | 马尔克斯  |               |             | |
:::
````

**用到的特性：**
- `groupBy="类别"` 按类别列分组，看板每列一个颜色
- `:select` 类型显示为 pill 标签（适合有限选项如"科幻/文学/历史"）
- `:number` 类型显示为千分位格式化的 Notion 风格标签
- `:link` 类型支持两种格式：直接 URL（`https://...`）或 Markdown 链接（`[名称](url)`），带外部链接图标，悬停高亮
- `titleCol="书名"` 指定看板卡片和里程碑标题

::::

---

## 场景四：旅行行程（时间轴 + 里程碑）

时间线视图展示旅行安排，里程碑视图展示重要节点。

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

````markdown
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
````

**用到的特性：**
- `timeline` 单点模式：每个事件显示为一个圆点
- `milestone` 视图：按时间顺序排列的卡片，显示备注内容
- `:status` 列控制时间轴节点颜色（todo=灰, doing=呼吸, done=实心）

::::

---

## 场景五：习惯打卡（纯表格 + checkbox）

用 checkbox 类型做每日习惯打卡表。

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

**用到的特性：**
- `:checkbox` 类型显示为实心/空心圆点（true=完成, false=未完成）
- 纯表格视图，类似打卡表

::::

---

## 场景六：年度计划（看板 + 进度）

个人成长计划，按状态分组的看板 + 整体进度视图。

::::tabs
tab: 演示效果

:::plan{title="2024 年度计划" views="board,progress" default="board" groupBy="状态" titleCol="关键结果" progressCol="完成度" statusCol="状态" priorityCol="优先级"}
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
:::plan{title="2024 年度计划" views="board,progress" default="board"
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

**用到的特性：**
- `board` + `progress` 组合，看板分组 + 环形进度图
- `groupBy="状态"` 按状态分组
- `priorityCol="优先级"` 在看板卡片和进度统计中显示优先级分布

::::

---

## 场景七：软件迭代（里程碑 + 时间轴范围模式）

里程碑视图展示版本发布，时间轴范围模式展示开发周期。

::::tabs
tab: 演示效果

:::plan{title="产品迭代" views="milestone,timeline" default="milestone" dateCol="发布日期" titleCol="版本" descCol="更新内容" startDate="开始" endDate="结束"}
| 版本:text | 发布日期:date | 更新内容:text | 开始:date | 结束:date |
|-----------|---------------|---------------|-----------|-----------|
| v1.0      | 2024-01-01    | 首个正式版本   | 2023-11-01| 2023-12-31|
| v1.5      | 2024-03-15    | 支持暗黑模式   | 2024-01-15| 2024-03-10|
| v2.0      | 2024-06-01    | 全新架构上线   | 2024-03-20| 2024-05-28|
:::

tab: 示例代码

````markdown
:::plan{title="产品迭代" views="milestone,timeline" default="milestone"
        dateCol="发布日期" titleCol="版本" descCol="更新内容"
        startDate="开始" endDate="结束"}
| 版本:text | 发布日期:date | 更新内容:text | 开始:date | 结束:date |
|-----------|---------------|---------------|-----------|-----------|
| v1.0      | 2024-01-01    | 首个正式版本   | 2023-11-01| 2023-12-31|
| v1.5      | 2024-03-15    | 支持暗黑模式   | 2024-01-15| 2024-03-10|
| v2.0      | 2024-06-01    | 全新架构上线   | 2024-03-20| 2024-05-28|
:::
````

**用到的特性：**
- `milestone` 视图：按发布日期排列的里程碑卡片，显示 `descCol` 的内容
- `timeline` 范围模式：`startDate="开始"` + `endDate="结束"` 渲染为甘特条
- 同时有 `dateCol`（发布日期）和 `startDate`/`endDate`（开发周期），timeline 优先使用范围模式

::::

---

## 场景八：自定义看板分组与顺序

用 `groupOrder` 属性覆盖默认的字母序排列。比如按"阶段"分组时，不指定 `groupOrder` 会按字母序变成 **测试 → 上线 → 设计 → 开发**，但业务上合理的顺序是 **设计 → 开发 → 测试 → 上线**。

::::tabs
tab: 演示效果

:::plan{views="board" groupBy="阶段" groupOrder="设计,开发,测试,上线" titleCol="任务"}
| 阶段:select | 任务:text | 负责人:text |
|-------------|-----------|-------------|
| 设计        | 首页原型  | Alice       |
| 开发        | API 接口  | Bob         |
| 测试        | 用例编写  | Carol       |
| 上线        | 生产部署  | Dave        |
:::

tab: 示例代码

````markdown
:::plan{views="board" groupBy="阶段" groupOrder="设计,开发,测试,上线" titleCol="任务"}
| 阶段:select | 任务:text | 负责人:text |
|-------------|-----------|-------------|
| 设计        | 首页原型  | Alice       |
| 开发        | API 接口  | Bob         |
| 测试        | 用例编写  | Carol       |
| 上线        | 生产部署  | Dave        |
:::
````

**用到的特性：**
- `groupOrder="设计,开发,测试,上线"` 同时定义看板分组和列顺序（从左到右），最多8个
- `:select` 是**列类型**（控制单元格显示为 pill 标签），`groupOrder` 是**看板属性**（定义分组和顺序），两者独立
- 不指定 `groupOrder` 时，`:select` 列默认按字母序排列，这里用 `groupOrder` 覆盖了默认顺序
- 8 种颜色按位置自动分配，均基于主题色派生

::::

---

## 参考

### 列类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `text` | 默认纯文本 | 任意文字 |
| `status` | 状态圆点（`todo`/`doing`/`done`） | `done` |
| `priority` | 优先级标签（`P0`/`P1`/`P2`） | `P0` |
| `date` | 日期，表格中带月份色条 | `2024-01-01` |
| `progress` | 进度条 | `65%` |
| `number` | 数字，自动千分位格式化，Notion 风格标签 | `4200` |
| `checkbox` | 勾选框（`true`/`false`） | `true` |
| `select` | 单选标签 | 任意文字 |
| `link` | 可点击链接 | `https://...` |

### 状态列

状态列使用 `status` 类型，支持三个值：

- `todo` — 待办，空心圆
- `doing` — 进行中，半实心圆 + 呼吸动画
- `done` — 已完成，实心圆

### 属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `title` | 组件标题 | `title="项目计划"` |
| `views` | 启用的视图 | `views="board,table"` |
| `default` | 默认视图 | `default="table"` |
| `groupBy` | board 分组列 | `groupBy="状态"` |
| `groupOrder` | board 自定义分组和列顺序（从左到右） | `groupOrder="待办,进行中,已完成"` |
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
| `steps` | ebbinghaus 复习间隔（逗号分隔天数） | `steps="1,3,7,14,30"` |

### 视图所需列

| 视图 | 所需列 | 说明 |
|------|--------|------|
| table | 无 | 永远可渲染 |
| list | 无 | 永远可渲染 |
| board | 无 | 永远可渲染 |
| timeline | `dateCol` 或 `startDate` 或 `endDate` | 单点或范围模式 |
| milestone | `dateCol` | 只支持单点模式 |
| progress | `progressCol` | 必须指定进度列 |
| ebbinghaus | `dateCol` | 艾宾浩斯复习计划，自动计算复习节点 |

> **关于列类型：** 视图所需列只要求列**存在**即可，**不强制要求特定类型**。例如 timeline 的 `dateCol` 用 `text` 类型也能工作（只要值能被 `new Date()` 解析）。但建议声明对应类型（如 `:date`、`:progress`）以获得更好的显示效果（月份色条、进度条等）。
