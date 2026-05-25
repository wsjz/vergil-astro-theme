import type { MemoItem } from '../../types';

export const notice = {
    title: '关于这个角落',
    paragraphs: [
        '这里是我的一方小天地，没有算法推荐，没有阅读量焦虑。',
        '如果你偶然路过，欢迎坐下来喝杯茶，慢慢读。',
    ],
    quote: '在互联网的喧嚣中，我们需要更多安静的角落。',
    actions: [
        { text: '随便逛逛', href: '/blog', icon: 'globe' },
    ],
} satisfies MemoItem;
