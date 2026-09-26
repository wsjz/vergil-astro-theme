# 参与 Vergil

Vergil 由个人在业余时间维护，任何形式的参与都欢迎 — 提 Bug、聊想法、改文档、翻译界面文字。

## 先开 issue

改代码之前建议先开一个 [issue](https://github.com/wsjz/vergil-astro-theme/issues) 说明你想做什么。

不是流程要求，是怕你白写：有些改动和主题的设计方向不一致，或者已经有人在做了，提前聊十分钟能省掉一个周末。

改错别字、修链接这种一眼就能判断的，直接提 PR 就行。

## 本地跑起来

```bash
pnpm install
pnpm dev
```

需要 Node.js 22。仓库自带的内容是演示用的，`pnpm reset` 可以清掉。

## 提交前

```bash
pnpm build
```

构建必须通过。

## 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 相册支持 masonry 布局
fix: 修复文档侧边栏在移动端不收起
docs: 补充界面语言的配置说明
refactor: 抽出共享的上下篇导航组件
```

一个 PR 一件事。如果你的改动横跨几个不相关的方面，拆成几个 PR 更容易被合入。

## 改了行为就要改文档

这是硬性要求。以下任何一项变化，都要在同一个 PR 里带上文档改动：

- `src/data/config/` 下字段的增删改名
- `src/content.config.ts` 的 schema 变化
- 指令的名字、属性、默认值变化
- 默认开关状态变化

文档在 `src/content/docs/vergil-guide/`，写法约定见其中的 `DOCS-CONVENTIONS.md`。

文档和代码脱节过一次，补了很久。不想再来一遍。

## 翻译

界面文案在 `src/i18n/`。`zh-CN.ts` 是基准，`en.ts` 声明成了 `typeof zhCN`，所以少写一个 key 就编译不过。

想加一种语言，照着 `en.ts` 复制一份，在 `index.ts` 里注册。注意只翻译主题界面的文字，用户自己写的内容和配置不在 i18n 范围内。

## License

提交代码即表示同意以 [MIT](LICENSE) 许可发布。
