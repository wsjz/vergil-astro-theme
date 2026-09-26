---
title: 媒体嵌入指令
excerpt: 图片、画廊、代码面板、音频、视频。把外部媒体嵌进文章，不用写任何 HTML。
publishDate: 'Aug 17 2026'
tags:
  - 使用指南
categories: ["博客相关"]
series: 内容指令示例
---

图片、音频、视频和代码面板。所有嵌入都在构建期处理，不引第三方播放器脚本。

---
### Image 图片

::::tabs
tab: 演示效果

::image{src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="风景照片"}

::image{src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" alt="带下载按钮" download="true"}

::image{src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" alt="正方形裁剪" ratio="1/1" width="300px"}

tab: 示例代码

````
::image{src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="风景照片"}

::image{src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" alt="带下载按钮" download="true"}

::image{src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" alt="正方形裁剪" ratio="1/1" width="300px"}
````

- `src`（**必填**）：图片地址
- `alt`：图片描述，会显示在图片下方作为 caption
- `width` / `height`：设置图片尺寸
- `bg`：背景颜色
- `padding`：内边距
- `ratio`：固定宽高比
- `download`：`true` 或自定义下载链接
- `fancybox`：`false` 可禁用点击放大

::::

---

### Gallery 图片画廊

::::tabs
tab: 演示效果

:::gallery{layout="grid" size="m" ratio="square"}
![山景1](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80)
![山景2](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80)
![森林](https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80)
![湖泊](https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80)
:::

tab: 示例代码

````
:::gallery{layout="grid" size="m" ratio="square"}
![山景1](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80)
![山景2](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80)
![森林](https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80)
![湖泊](https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80)
:::
````

- `layout`：`grid`（网格，默认）或 `flow`（瀑布流）
- `size`：`xs` | `s` | `m` | `l` | `xl` | `mix`
- `ratio`：`square` | `portrait` | `origin`（保持原始比例）

::::

---

 ### Banner 横幅

::::tabs
tab: 演示效果

:::banner{title="Vergil 主题" subtitle="Astro 驱动的个人博客主题" bg="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"}
:::

tab: 示例代码

````
:::banner{title="Vergil 主题" subtitle="Astro 驱动的个人博客主题" bg="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"}
:::
````

- `title`（**必填**）：主标题
- `subtitle`：副标题
- `bg`：背景图片地址
- `avatar`：头像图片地址
- `link`：点击跳转链接

::::

---

### Panel 代码面板

将多个相关代码块或文字段落放入同一个面板中并列展示。每段有独立的左侧标签和右侧说明，支持每段单独复制。

#### 场景 1：多语言代码对比

::::tabs
tab: 演示效果

:::panel
```js title="JavaScript" right="ES2024"
const user = await fetch('/api/user').then(r => r.json())
console.log(user.name)
```

```ts title="TypeScript" right="v5.7"
interface User { name: string }
const user = await fetch<User>('/api/user').then(r => r.json())
console.log(user.name)
```

```py title="Python" right="3.13"
import requests
user = requests.get('/api/user').json()
print(user['name'])
```
:::

tab: 示例代码

`````markdown
:::panel
```js title="JavaScript" right="ES2024"
const user = await fetch('/api/user').then(r => r.json())
```

```ts title="TypeScript" right="v5.7"
const user = await fetch<User>('/api/user').then(r => r.json())
```
:::
`````

- `title` -> 左侧标签（场景/功能描述）
- `right` -> 右侧说明（语言、版本、文件名等任意文本）

::::

---

#### 场景 2：前后端配对

::::tabs
tab: 演示效果

:::panel
```js title="前端调用" right="React"
api.getUser(id).then(user => {
  setUser(user)
})
```

```go title="后端实现" right="Go 1.23"
func GetUser(w http.ResponseWriter, r *http.Request) {
  id := r.URL.Query().Get("id")
  user := db.FindUser(id)
  json.NewEncoder(w).Encode(user)
}
```
:::

tab: 示例代码

`````markdown
:::panel
```js title="前端调用" right="React"
fetch('/api/user').then(r => r.json())
```

```go title="后端实现" right="Go 1.23"
func GetUser(w http.ResponseWriter, r *http.Request) { ... }
```
:::
`````

::::

---

#### 场景 3：请求与响应

::::tabs
tab: 演示效果

:::panel
```http title="请求" right="HTTP/1.1"
GET /api/posts?page=1&limit=10
Authorization: Bearer eyJhbG...
```

```json title="响应" right="JSON"
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10
}
```
:::

tab: 示例代码

`````markdown
:::panel
```http title="请求" right="HTTP/1.1"
GET /api/posts?page=1&limit=10
```

```json title="响应" right="JSON"
{ "data": [...], "total": 42 }
```
:::
`````

::::

---

#### 场景 4：配置文件多环境对比

::::tabs
tab: 演示效果

:::panel
```yaml title="开发环境" right="dev.yaml"
database: localhost:5432
debug: true
log_level: debug
```

```yaml title="生产环境" right="prod.yaml"
database: prod.db.internal:5432
debug: false
log_level: warn
```
:::

tab: 示例代码

`````markdown
:::panel
```yaml title="开发环境" right="dev.yaml"
database: localhost:5432
```

```yaml title="生产环境" right="prod.yaml"
database: prod.db.internal:5432
```
:::
`````

::::

---

#### 场景 5：普通文字内容分段

::::tabs
tab: 演示效果

:::panel

<!-- label: 快速上手 | 1 分钟 -->
创建项目只需一行命令：

```bash
npx create-my-app
```

<!-- label: 详细步骤 | 5 分钟 -->
1. 确保 Node.js >= 18
2. 运行 `npx create-my-app`
3. 按提示选择模板
4. 进入目录运行 `npm run dev`

<!-- label: 进阶配置 | 可选 -->
如需自定义配置，可在项目根目录创建 `my-app.config.js`：

```js
export default {
  theme: 'default',
  plugins: ['@my-app/i18n']
}
```

:::

tab: 示例代码

`````markdown
:::panel

<!-- label: 快速上手 | 1 分钟 -->
创建项目只需一行命令：

```bash
npx create-my-app
```

<!-- label: 详细步骤 | 5 分钟 -->
1. 确保 Node.js >= 18
2. 运行 `npx create-my-app`

:::
`````

- `<!-- label: 左边 | 右边 -->` 用 `|` 分隔左右标签
- 若不需要右边标签，可省略 `|` 及之后内容

::::

---

#### 场景 6：多视角叙事

::::tabs
tab: 演示效果

:::panel

<!-- label: 用户视角 | 痛点 -->
界面突然卡住，刷新后数据全没了，心情很崩溃。

<!-- label: 开发者视角 | 根因 -->
前端在 `onMount` 时未做 Loading 态处理，接口 5s 超时导致用户以为页面死了，重复刷新引发竞态条件。

<!-- label: 产品经理视角 | 方案 -->
需要加 Loading 骨架屏 + 请求防抖 + 断网重试机制。

:::

tab: 示例代码

`````markdown
:::panel

<!-- label: 用户视角 | 痛点 -->
界面突然卡住，刷新后数据全没了。

<!-- label: 开发者视角 | 根因 -->
前端在 `onMount` 时未做 Loading 态处理。

:::
`````

::::

---

#### 场景 7：正反观点对比

::::tabs
tab: 演示效果

:::panel

<!-- label: 支持 TypeScript | 优势 -->
TypeScript 的严格类型让大型项目维护成本大幅降低，重构时信心十足，IDE 提示也能减少低级错误。

<!-- label: 反对 TypeScript | 劣势 -->
小项目引入 TS 的 overhead 过高，类型体操反而增加了心智负担，配置复杂，不如直接用 JSDoc + 类型检查。

:::

tab: 示例代码

`````markdown
:::panel

<!-- label: 支持 TypeScript | 优势 -->
TypeScript 的严格类型让大型项目维护成本大幅降低。

<!-- label: 反对 TypeScript | 劣势 -->
小项目引入 TS 的 overhead 过高。

:::
`````

::::

---

#### 场景 8：时间线对比

::::tabs
tab: 演示效果

:::panel

<!-- label: 2023 | Webpack 时代 -->
当时使用 Webpack 5，构建一次要 30 秒，热更新也经常失败，开发体验很差。

<!-- label: 2025 | Vite 时代 -->
迁移到 Vite 后，冷启动 < 1 秒，HMR 几乎无感知，开发效率提升了数倍。

<!-- label: 展望 | Rspack 未来 -->
明年计划尝试 Rspack，在保持 Webpack 兼容的同时进一步提升构建性能。

:::

tab: 示例代码

`````markdown
:::panel

<!-- label: 2023 | Webpack 时代 -->
当时使用 Webpack 5，构建一次要 30 秒。

<!-- label: 2025 | Vite 时代 -->
迁移到 Vite 后，冷启动 < 1 秒。

:::
`````

::::

---

### Audio 音频播放器

在文章中插入音频，支持本地音频、网易云音乐和语音消息三种模式。

#### 标准播放器（本地音频）

::::tabs
tab: 演示效果

:::audio{src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="SoundHelix Song 1" artist="T. Schürger" width="500px"}
:::

tab: 示例代码

`````markdown
:::audio{src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="SoundHelix Song 1" artist="T. Schürger" width="500px"}
:::
`````

- `src`（**必填**）：音频文件地址
- `title`：歌曲标题
- `artist`：艺术家
- `cover`：封面图 URL（可选，不填则显示音乐图标）
- `align`：对齐方式，可选 `left`（默认）、`center`、`right`
- `width`：自定义宽度，如 `width="400px"`

**居中对齐示例：**

:::audio{src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="SoundHelix Song 1" artist="T. Schürger" align="center"}
:::

**自定义宽度示例：**

:::audio{src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="SoundHelix Song 1" artist="T. Schürger" width="500px"}
:::

::::

---

#### 网易云音乐

**迷你模式（默认）：**

::::tabs
tab: 演示效果

:::audio{netease="1450008309" title="晴天" artist="周杰伦" width="300px"}
:::

tab: 示例代码

`````markdown
:::audio{netease="1450008309" title="晴天" artist="周杰伦" width="300px"}
:::
`````

::::

**卡片模式（带封面）：**

::::tabs
tab: 演示效果

:::audio{netease="1450008309" title="晴天" artist="周杰伦" mode="card"}
:::

tab: 示例代码

`````markdown
:::audio{netease="1450008309" title="晴天" artist="周杰伦" mode="card"}
:::
`````

- `netease`（**必填**）：网易云音乐歌曲 ID，从网易云音乐网页版分享链接中获取
- `mode`：播放器样式，可选 `mini`（默认，窄条模式）或 `card`（带封面大卡片）
- `align`：对齐方式，可选 `left`（默认）、`center`、`right`
- `width`：自定义宽度，如 `width="400px"`

::::

---

#### 语音消息

::::tabs
tab: 演示效果

:::audio{voice="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" duration="15" width="200px"}
:::

tab: 示例代码

`````markdown
:::audio{voice="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" duration="15" width="200px"}
:::
`````

- `voice`（**必填**）：语音文件地址
- `duration`：语音时长（秒），用于显示波形长度
- `align`：对齐方式，可选 `left`（默认）、`center`、`right`
- `width`：自定义宽度，如 `width="400px"`

::::

---

### Video 视频播放器

在文章中插入视频，支持本地视频、Bilibili 和 YouTube 三种模式。本地视频支持画中画（PiP）浮动播放器。

#### 本地视频（带封面）

::::tabs
tab: 演示效果

:::video{src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" poster="https://images.unsplash.com/photo-1490750967868-88aa4f44dbb3?w=800&q=80" ratio="16/9"}
:::

tab: 示例代码

`````markdown
:::video{src="https://example.com/video.mp4" poster="https://example.com/poster.jpg" ratio="16/9"}
:::
`````

- `src`（**必填**）：视频文件地址
- `poster`：封面图，显示自定义播放按钮覆盖层，点击后播放
- `ratio`：宽高比，默认 `16/9`，可选 `4/3`、`1/1`
- `width`：最大宽度，如 `width="600px"`
- `align`：对齐方式，可选 `left`（默认）、`center`、`right`
- `autoplay`：`true` 自动播放（静音）
- `pip`：画中画模式，可选 `auto`（默认，滚动离开自动触发）、`manual`（手动触发）、`off`（关闭）

::::

---

#### 本地视频（原生 controls）

不指定 `poster` 时，直接使用原生 `<video controls>` 播放器。

::::tabs
tab: 演示效果

:::video{src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" ratio="16/9"}
:::

tab: 示例代码

`````markdown
:::video{src="https://example.com/video.mp4" ratio="16/9"}
:::
`````

- 不指定 `poster` 时，使用原生浏览器播放器控件
- 其他参数与带封面模式相同

::::

---

#### 本地视频（画中画 auto）

视频播放中向下滚动离开视口时，自动弹出右下角浮动播放器。滚动回原位置时自动恢复。

::::tabs
tab: 演示效果

:::video{src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" poster="https://images.unsplash.com/photo-1490750967868-88aa4f44dbb3?w=800&q=80" ratio="16/9" pip="auto"}
:::

tab: 示例代码

`````markdown
:::video{src="..." poster="..." ratio="16/9" pip="auto"}
:::
`````

- `pip="auto"`（默认）：播放中离开视口自动进入画中画
- 浮动播放器支持拖动、播放/暂停、进度跳转
- 点击 ↩ 回到原位并恢复播放，点击 × 直接关闭

::::

---

#### 本地视频（画中画 manual）

不自动触发，鼠标悬停视频右上角显示画中画按钮，点击后手动进入浮动播放。

::::tabs
tab: 演示效果

:::video{src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" poster="https://images.unsplash.com/photo-1490750967868-88aa4f44dbb3?w=800&q=80" ratio="16/9" pip="manual"}
:::

tab: 示例代码

`````markdown
:::video{src="..." poster="..." ratio="16/9" pip="manual"}
:::
`````

- `pip="manual"`：鼠标悬停时右上角显示画中画按钮，点击手动触发
- 适合不希望自动打扰读者的场景

::::

---

#### 本地视频（居中对齐）

::::tabs
tab: 演示效果

:::video{src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" poster="https://images.unsplash.com/photo-1490750967868-88aa4f44dbb3?w=800&q=80" align="center" width="500px" ratio="4/3"}
:::

tab: 示例代码

`````markdown
:::video{src="..." poster="..." align="center" width="500px" ratio="4/3"}
:::
`````

- `align="center"`：视频容器居中对齐
- `width="500px"`：限制最大宽度
- `ratio="4/3"`：4:3 宽高比

::::

---

#### Bilibili

::::tabs
tab: 演示效果

:::video{bilibili="BV17VmcBJEZz"}
:::

tab: 示例代码

`````markdown
:::video{bilibili="BV17VmcBJEZz"}
:::
`````

- `bilibili`（**必填**）：B 站 BV 号
- `ratio`、`width`、`align` 与本地视频相同
- 不支持画中画（iframe 内视频无法控制）

::::

---

#### YouTube

::::tabs
tab: 演示效果

:::video{youtube="jfKfPfyJRdk"}
:::

tab: 示例代码

`````markdown
:::video{youtube="jfKfPfyJRdk"}
:::
`````

- `youtube`（**必填**）：YouTube 视频 ID
- `autoplay`：`true` 自动播放（自动静音，符合 YouTube 策略）
- `ratio`、`width`、`align` 与本地视频相同
- 不支持画中画

::::
