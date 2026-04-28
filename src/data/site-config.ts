import avatar from '../assets/images/avatar.jpg';
import hero from '../assets/images/hero.jpg';
import type { SiteConfig } from '../types';

export const fontsRegistry: Record<string, { cssName: string; family: string; path?: string; cdn?: string; format?: string }> = {
    inter: {
        cssName: 'Inter Variable',
        family: 'sans-serif',
    },
    lxgwwenkai: {
        cssName: 'LXGW WenKai',
        family: 'sans-serif',
        path: '/fonts/LXGWWenKai-Regular.ttf',
        format: 'truetype',
    },
    maokenZhuyuanTi: {
        cssName: 'MaokenZhuyuanTi',
        family: 'sans-serif',
        path: '/fonts/maoken-zhuyuan-ti.ttf',
        format: 'truetype',
    },
    monoFonts: {
        cssName: 'ui-monospace',
        family: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
    },
};

const siteConfig: SiteConfig = {
    website: 'https://example.com',
    fonts: {
        display: 'maokenZhuyuanTi',
        body: 'lxgwwenkai',
        ui: 'maokenZhuyuanTi',
        mono: 'monoFonts',
    },
    avatar: {
        src: avatar,
        alt: 'Ethan Donovan'
    },
    title: 'Vergil',
    subtitle: 'Minimal Astro.js theme',
    description: 'Astro.js and Tailwind CSS theme for blog and portfolio by justgoodui.com',
    image: {
        src: '/vergil-preview.jpg',
        alt: 'Vergil - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
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
    ],
    views: {
        default: { name: '主页', path: '/' },
        resume: { name: '简历', path: '/views/resume/' },
        minimal: { name: '沉浸阅读', path: '/views/minimal/', enabled: true }
    },
    footerNavLinks: [
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
            href: 'https://github.com/justgoodui/vergil-astro-theme'
        },
        {
            text: '赞助',
            href: 'https://github.com/sponsors/justgoodui'
        },
    ],
    socialLinks: [
        {
            text: 'Dribbble',
            href: 'https://dribbble.com/'
        },
        {
            text: 'Instagram',
            href: 'https://instagram.com/'
        },
        {
            text: 'X/Twitter',
            href: 'https://twitter.com/'
        }
    ],
    hero: {
        title: 'Hello，我是 **Ethan**!',
        text: '我是 **Ethan Donovan**，一名在 Amazing Studio 工作的 Web 开发者。\n\n喜欢互联网冲浪、旅行、户外运动、写博客、摄影、看电影、编程和听音乐。',
        titleIcon: 'Sparkles',
        textIcon: 'Zap',
        image: {
            src: hero,
            alt: 'A person sitting at a desk in front of a computer'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        enabled: true,
        title: 'Subscribe to Vergil Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        form: {
            action: '#'
        }
    },
    postsPerPage: 8,
    projectsPerPage: 8,
    search: {
        enabled: true
    },
    comments: {
        enabled: true,
        provider: 'giscus',
        giscus: {
            repo: 'wsjz/issues',
            repoId: 'R_kgDONgr0wg',
            category: 'General',
            categoryId: 'DIC_kwDONgr0ws4ClbF3',
            mapping: 'pathname',
            strict: false,
            reactionsEnabled: true,
            emitMetadata: false,
            inputPosition: 'top',
            theme: 'preferred_color_scheme',
            lang: 'zh-CN',
            loading: 'lazy'
        },
        artalk: {
            server: 'https://artalk.example.com',
            site: 'Vergil Blog'
        }
    },
    albums: {
        enabled: true
    },
    splash: {
        enabled: true,
        backgroundImage: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80'
        ],
        overlay: 'rgba(0,0,0,0.1)',
        textShadow: true,
        fallbackBg: 'bg-black',
        gradientColor: '#2d2d2d',
        gradientHeight: 'h-56',
        backdropBlur: '12px',
        slideDuration: 12,
        title: 'Vergil',
        subtitle: 'Minimal Astro.js theme',
        nav: [
            { text: 'Github', href: 'https://github.com', icon: 'github' },
            { text: '友链', href: '/links', icon: 'link' },
            { text: '关于', href: '/about', icon: 'user' },
            { text: 'Travelling', href: '/travelling', icon: 'train' }
        ]
    },
    agent: {
        enabled: true,
        provider: 'rive',
        // rive: { src: '/model.riv' },
        // live2d: { modelPath: '/model.json' },
    },
    sidebar: {
        // 可配置：recentPosts, siteInfo
        left: ['recentPosts', 'siteInfo'],
        // 右侧默认组件（列表页/首页/归档等）
        // 可配置：welcome, heatmap, recentPosts, featured, tags, ghCard
        right: ['welcome', 'heatmap', 'featured', 'tags'],
        // 文章页右侧（目前由页面 slot 覆盖，此配置暂未生效）
        // 可配置：toc, related, featured
        postRight: ['toc', 'featured'],
        // 文档页右侧（目前由页面 slot 覆盖，此配置暂未生效）
        // 可配置：toc
        docRight: ['toc'],
        components: {
            welcome: {
                text: '记录技术、生活与思考',
            },
            recentPosts: {
                limit: 5,
            },
            featured: {
                limit: 3,
            },
            tags: {
                limit: 6,
            },
            related: {
                limit: 3,
            },
        },
    },
};

export default siteConfig;
