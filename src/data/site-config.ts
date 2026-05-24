import avatar from '../assets/images/avatar.jpg';
import hero from '../assets/images/hero.jpg';
import type { SiteConfig } from '../types';

// ── 字体注册表 ──
export { fontsRegistry } from './config/fonts';
import { fonts } from './config/fonts';

// ── 导航 ──
import { headerNavLinks, views, footerNavLinks } from './config/nav';

// ── 网站基本信息 ──
import { siteInfo, heroData, subscribe, postsPerPage, projectsPerPage } from './config/identity';

// ── 功能开关 ──
import { comments, agent, sidebar, floatingAudio, tagCloud } from './config/features';

// ── 开屏页 ──
import { splash } from './config/splash';

// ── 链接分组 ──
import { links, screenshotService } from './config/links';

const siteConfig: SiteConfig = {
    // ── 基础设置 ──
    website: 'https://example.com',
    fonts,
    avatar: {
        src: avatar,
        alt: 'Alex'
    },

    // ── 网站信息 ──
    ...siteInfo,

    // ── 导航 ──
    headerNavLinks,
    views,
    footerNavLinks,

    // ── Hero / 订阅 / 分页 ──
    hero: {
        ...heroData,
        image: {
            src: hero,
            alt: 'A person sitting at a desk in front of a computer'
        }
    },
    subscribe,
    postsPerPage,
    projectsPerPage,

    // ── 功能开关 ──
    comments,
    splash,
    agent,
    links,
    screenshotService,
    sidebar,
    floatingAudio,
    tagCloud,

    // ── 版权提示 ──
    copyright: '© 本文著作权归作者所有，转载请注明出处。',
};

export default siteConfig;
