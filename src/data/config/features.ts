import type { SiteConfig } from '../../types';
import { welcome } from './welcome';
import { notice } from './notice';

export const comments = {
    enabled: true,
    provider: 'giscus' as const,
    giscus: {
        repo: 'wsjz/issues',
        repoId: 'R_kgDONgr0wg',
        category: 'General',
        categoryId: 'DIC_kwDONgr0ws4ClbF3',
        mapping: 'pathname' as const,
        strict: false,
        reactionsEnabled: true,
        emitMetadata: false,
        inputPosition: 'top' as const,
        theme: 'preferred_color_scheme' as const,
        lang: 'zh-CN' as const,
        loading: 'lazy' as const
    },
    artalk: {
        server: 'https://artalk.example.com',
        site: 'Vergil Blog'
    }
} satisfies NonNullable<SiteConfig['comments']>;

export const agent = {
    enabled: true,
    provider: 'rive' as const,
    name: 'Miki',
    // rive: { src: '/model.riv' },
    // live2d: { modelPath: '/model.json' },
} satisfies NonNullable<SiteConfig['agent']>;

export const sidebar = {
    // 可配置：recentPosts, siteInfo
    left: ['recentPosts', 'siteInfo'],
    // 可配置：welcome, heatmap, recentPosts, featured, tags, ghCard
    right: ['welcome', 'heatmap', 'featured', 'tags', 'notice'],

    // 文章页右侧（目前由页面 slot 覆盖，此配置暂未生效）
    // 可配置：toc, related, featured
    postRight: ['toc', 'featured'],
    // 文档页右侧（目前由页面 slot 覆盖，此配置暂未生效）
    // 可配置：toc
    docRight: ['toc'],
    // 左侧栏站内导航
    nav: [
        { label: '首页', href: '/', icon: 'home' },
        { label: '博客', href: '/blog', icon: 'book-open' },
        { label: '专栏', href: '/series', icon: 'bookmark' },
        { label: '文档', href: '/docs', icon: 'book-text' },
        { label: '相册', href: '/albums', icon: 'image' },
        { label: '留言', href: '/contact', icon: 'message-circle' },
    ],
    components: {
        welcome,
        notice,
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
};

export const floatingAudio = {
    enabled: true,
    autoplay: false,
};

export const tagCloud = {
    enabled: true,
};
