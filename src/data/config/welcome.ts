import type { MemoItem } from '../../types';

export const welcome = {
    title: '欢迎来到 Vergil',
    paragraphs: [
        '这里是我的数字花园，记录技术思考、生活碎片与偶然的灵光一现。',
    ],
    quote: '',
    actions: [
        { text: '随便逛逛～', href: '/blog', icon: 'globe' },
        { text: '关于我', href: '/about', icon: 'message-circle' },
    ],
} satisfies MemoItem;
