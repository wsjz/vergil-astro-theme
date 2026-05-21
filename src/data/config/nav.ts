export const headerNavLinks = [
    {
        label: '页面',
        icon: 'home',
        children: [
            { label: '主页', href: '/', icon: 'home' },
            { label: '简历', href: '/views/resume/', icon: 'file-text' },
            { label: '沉浸阅读', href: '/views/minimal/', icon: 'book-open' }
        ]
    },
    {
        label: '知识库',
        icon: 'database',
        children: [
            { label: '文档', href: '/docs', icon: 'book-open' },
            { label: '专栏', href: '/series', icon: 'book-open' },
            { label: '笔记', href: '/blog', icon: 'file-text' },
            { label: '项目', href: '/projects', icon: 'folder-open' }
        ]
    },
    {
        label: '生活',
        icon: 'heart',
        children: [
            { label: '相册', href: '/albums', icon: 'image' },
            { label: '想法', href: '/thoughts', icon: 'lightbulb' }
        ]
    },
    {
        label: '更多',
        icon: 'more-horizontal',
        children: [
            { label: '留言', href: '/contact', icon: 'message-square' },
            { label: '建站历史', href: '/history', icon: 'clock' }
        ]
    }
];

export const views = {
    default: { name: '主页', path: '/' },
    resume: { name: '简历', path: '/views/resume/' },
    minimal: { name: '沉浸阅读', path: '/views/minimal/', enabled: true }
};

export const footerNavLinks = [
    {
        text: '关于',
        href: '/about'
    },
    {
        text: '联系',
        href: '/contact'
    },
    {
        text: '贡献',
        href: 'https://github.com/wsjz/vergil-astro-theme'
    },
    {
        text: '赞助',
        href: 'https://github.com/sponsors'
    },
];
