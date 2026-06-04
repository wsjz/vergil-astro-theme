import type { SiteConfig } from '../../types';

export const analytics = {
    enabled: true,
    provider: 'umami' as const,
    umami: {
        // Umami Cloud: https://cloud.umami.is
        // 在 Umami Cloud 后台获取 Website ID
        websiteId: '',
        scriptUrl: 'https://cloud.umami.is/script.js',
        // Umami Cloud API 地址
        apiHost: 'https://api.umami.is/v1',
        // API Token，在 Umami Cloud 后台生成
        apiToken: '',
        statsPage: {
            path: '/stats',
            modules: ['overview', 'trends', 'pages', 'referrers', 'devices', 'locations', 'realtime'],
            defaultRange: '7d',
        },
    },
} satisfies SiteConfig['analytics'];
