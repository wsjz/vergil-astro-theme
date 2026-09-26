#!/usr/bin/env node
/**
 * 把演示内容清空，留一个干净的起点。
 *
 * Vergil 的仓库同时是主题源码和它自己的演示站，所以 clone 下来会自带
 * 十几篇文章、两套示例文档、几个相册。自己用的时候这些都该删掉，
 * 但手动删很容易漏——配置里还散落着示例用的站点名、导航、友链。
 *
 * 跑一次 `pnpm reset` 就全清了。
 *
 * 默认保留 Vergil 官方文档（src/content/docs/vergil-guide），因为它就是
 * 使用说明，删了之后站内就查不到指令怎么写了。要一并删除加 --all。
 *
 * 加 --dry 只打印将要做什么，不实际改动。
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DRY = process.argv.includes('--dry');
const ALL = process.argv.includes('--all');
const ROOT = process.cwd();

const log = (icon, msg) => console.log(`  ${icon} ${msg}`);

function rm(rel) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return false;
    if (!DRY) fs.rmSync(abs, { recursive: true, force: true });
    log('删除', rel);
    return true;
}

function write(rel, content) {
    const abs = path.join(ROOT, rel);
    if (!DRY) {
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, content, 'utf-8');
    }
    log('重写', rel);
}

/** 清空目录里的内容文件，保留目录本身 */
function empty(rel, exts = ['.md', '.mdx', '.json']) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return;
    let n = 0;
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
        const p = path.join(abs, entry.name);
        if (entry.isDirectory() || exts.some((e) => entry.name.endsWith(e))) {
            if (!DRY) fs.rmSync(p, { recursive: true, force: true });
            n++;
        }
    }
    if (n) log('清空', `${rel}  (${n} 项)`);
}

console.log(DRY ? '\n预演模式，不会真的改动文件\n' : '\n开始清理演示内容\n');

// ── 内容 ──
console.log('内容');
empty('src/content/blog');
empty('src/content/moments');
empty('src/content/thoughts');
empty('src/content/projects');
empty('src/content/series');
empty('src/content/albums');
rm('src/content/docs/kubernetes');
rm('src/content/docs/react-guide');
if (ALL) rm('src/content/docs/vergil-guide');

// pages 里 contact/terms 是有用的骨架，只清掉正文
write(
    'src/content/pages/about.md',
    `---
title: 关于
seo:
  title: 关于本站与我
  description: 介绍你自己，以及这个站点想记录些什么。
---

这里写你的自我介绍。

删掉这段话，换成你想说的。
`
);
// 导航和页脚都链到 /contact，删掉会留下 404，所以只清正文
write(
    'src/content/pages/contact.md',
    `---
title: 留言板
seo:
  title: 留言板 - 联系我
  description: 留下你的想法、问题或建议，或者直接发邮件找我。
---

想说的话可以写在下面的评论区，也可以发邮件给我。

- **邮箱：** [you@example.com](mailto:you@example.com)

把上面的邮箱换成你自己的。评论区需要在 \`src/data/config/features.ts\` 里开启。
`
);

write(
    'src/content/pages/terms.md',
    `---
title: 使用条款
seo:
  title: 使用条款与隐私说明
  description: 本站内容的使用许可，以及访问时会收集哪些信息。
---

## 内容许可

写清楚你的文章允许别人怎么用，比如署名转载、禁止商用之类的。

## 隐私

写清楚这个站点会不会收集访客信息。如果你接了统计服务，在这里说明。

## 免责

写清楚站内内容仅代表个人观点，不构成任何建议。

以上三节都是占位，按你的实际情况改写。
`
);

// 简历留一个空骨架
write(
    'src/content/resume/index.md',
    `---
name: 你的名字
title: 你的职位
summary: 一句话介绍自己。
contacts: []
sections: []
---
`
);

// ── 素材 ──
console.log('\n素材');
rm('src/assets/images/albums-demo');
for (const f of fs.existsSync(path.join(ROOT, 'src/assets/images'))
    ? fs.readdirSync(path.join(ROOT, 'src/assets/images'))
    : []) {
    if (/^(post-\d+|project-\d+)\./.test(f)) rm(`src/assets/images/${f}`);
}
rm('public/videos');

// ── 配置 ──
console.log('\n配置');
const IDENTITY = `export const siteInfo = {
    title: '你的站点名',
    /** 主题界面文案的语言，也决定 <html lang> 和日期格式。可选 'zh-CN' | 'en' */
    locale: 'zh-CN',
    subtitle: '一句话副标题',
    description: '用一两句话说明这个站点是关于什么的，会用在 SEO 和分享卡片上。',
    image: {
        src: '/vergil-preview.jpg',
        alt: '你的站点名'
    },
    /**
     * 备案信息，中国大陆站点用。每一项可以只写文字，也可以带跳转链接。
     * 留空则左侧栏不显示备案区块。
     *
     * 备案号与主体身份绑定，不要填别人的。示例：
     *   icp: [
     *       { text: '京ICP备00000000号-1', href: 'https://beian.miit.gov.cn/' },
     *   ],
     */
    icp: [] as Array<{ text: string; href?: string }>,
};

export const heroData = {
    title: '你好，我是 **你的名字**',
    text: '这里写一段自我介绍。支持 **Markdown**，换行用 \\\\n\\\\n。',
    titleIcon: 'Sparkles',
    textIcon: 'Zap',
    actions: [
        {
            text: '关于我',
            href: '/about'
        }
    ]
};

export const subscribe = {
    enabled: false,
    title: '订阅更新',
    text: '填入你的邮件订阅服务地址后再开启。',
    form: {
        action: '#'
    }
};

export const postsPerPage = 8;
export const projectsPerPage = 8;
`;
write('src/data/config/identity.ts', IDENTITY);

write(
    'src/data/config/links.ts',
    `/**
 * 友链、网站收藏、影单等外链数据，供 :::sites 和 :::posters 指令使用。
 * key 是分组名，在指令里用 group="分组名" 引用，例如：
 *
 *   export const links = {
 *       friends: [
 *           { title: '某人的博客', url: 'https://example.com', description: '一句话介绍' },
 *       ],
 *   };
 *
 * 字段说明见文档「站点卡片」与「海报墙」。
 */
export const links = {};

/** 自动截图服务，:::sites 没填 icon 时用它生成缩略图。可选 'thumio' | 'mshots' */
export const screenshotService = 'thumio';
`
);

// 右侧栏两张 Memo 卡片，默认写的是 Vergil 演示站的自我介绍
write(
    'src/data/config/welcome.ts',
    `import type { MemoItem } from '../../types';

/**
 * 右侧栏的第一张 Memo 便签卡片。内容完全由你决定。
 * 不想要就到 features.ts 的 sidebar.components 里取消注册。
 */
export const welcome = {
    title: '这是什么',
    paragraphs: ['用一两句话介绍这个站点是做什么的。'],
    quote: '',
    actions: [{ text: '关于', href: '/about', icon: 'book-open' }],
} satisfies MemoItem;
`
);

write(
    'src/data/config/notice.ts',
    `import type { MemoItem } from '../../types';

/**
 * 右侧栏的第二张 Memo 便签卡片。想加更多卡片，照这个文件新建一个，
 * 再到 features.ts 的 sidebar.components 里注册。
 */
export const notice = {
    title: '公告',
    paragraphs: ['这里可以放公告、近况，或者任何你想置顶的话。'],
    quote: '',
    actions: [],
} satisfies MemoItem;
`
);

console.log('\n完成。接下来：');
console.log('  1. 编辑 src/data/config/identity.ts 填上你的站点信息');
console.log('  2. 编辑 src/data/site-config.ts 把 website 改成你的域名');
console.log('  3. 编辑 src/data/config/nav.ts 调整导航菜单');
console.log('  4. 在 src/content/blog/ 下新建第一篇文章');
console.log('  5. pnpm dev\n');
if (DRY) console.log('（以上都没有真的执行，去掉 --dry 才会生效）\n');
