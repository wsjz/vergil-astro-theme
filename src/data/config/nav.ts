export const headerNavLinks = [
    {
        label: '页面',
        icon: 'Home',
        children: [
            { label: '主页', href: '/', icon: 'Home' },
            { label: '简历', href: '/views/resume/', icon: 'FileText' },
            { label: '沉浸阅读', href: '/views/minimal/', icon: 'BookOpen' }
        ]
    },
    {
        label: '知识库',
        icon: 'Database',
        children: [
            { label: '文档', href: '/docs', icon: 'BookOpen' },
            { label: '专栏', href: '/series', icon: 'BookOpen' },
            { label: '笔记', href: '/blog', icon: 'FileText' },
            { label: '项目', href: '/projects', icon: 'FolderOpen' }
        ]
    },
    {
        label: '生活',
        icon: 'Heart',
        children: [
            { label: '相册', href: '/albums', icon: 'Image' },
            { label: '想法', href: '/thoughts', icon: 'Lightbulb' }
        ]
    },
    {
        label: '更多',
        icon: 'MoreHorizontal',
        children: [
            { label: '留言', href: '/contact', icon: 'MessageSquare' },
            { label: '建站历史', href: '/history', icon: 'Clock' }
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

