import type { MemoItem } from '../../types';

/**
 * 右侧栏的欢迎卡片。这是一张 Memo 便签卡片，内容完全由你决定。
 * 换成你自己站点的介绍即可，格式见文档「Memo 便签卡片」。
 */
export const welcome = {
    title: '这是什么',
    paragraphs: [
        'Vergil 是一套 Astro 建站框架，你正在看的就是它的演示站兼官方文档。',
        '页面上每一个组件、每一种排版，都能在文档里找到对应的写法。',
    ],
    quote: '',
    actions: [
        { text: '快速开始', href: '/docs/vergil-guide/01-快速开始/', icon: 'zap' },
        { text: 'GitHub', href: 'https://github.com/wsjz/vergil-astro-theme', icon: 'github' },
    ],
} satisfies MemoItem;
