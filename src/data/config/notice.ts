import type { MemoItem } from '../../types';

/**
 * 右侧栏的第二张 Memo 卡片。想加更多卡片，照这个文件新建一个即可，
 * 再到 features.ts 的 sidebar.components 里注册。
 */
export const notice = {
    title: '怎么用',
    paragraphs: [
        '写 Markdown，用 `:::` 指令插入提示框、时间线、图表、相册、看板。',
        '不需要写组件，不需要碰样式。',
    ],
    quote: '内容归你，呈现交给主题。',
    actions: [
        { text: '内容指令', href: '/docs/vergil-guide/03-基本创作/内容指令/', icon: 'book-open' },
    ],
} satisfies MemoItem;
