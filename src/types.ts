export type ImageInput = {
    src: ImageMetadata | string;
    alt?: string;
    caption?: string;
};

export type NavChild = {
    label: string;
    href: string;
    icon?: string;
};

export type NavItem = {
    label: string;
    icon: string;
    href?: string;
    children?: NavChild[];
};

export type Link = {
    text: string;
    href: string;
};

export type SiteLabel = {
    name: string;
    color: string;
};

export type SiteItem = {
    title: string;
    url: string;
    description?: string;
    icon?: string;
    cover?: string;
    labels?: SiteLabel[];
};

export type SiteConfigLinks = Record<string, SiteItem[]>;

export type Hero = {
    title?: string;
    text?: string;
    image?: ImageInput;
    actions?: Link[];
    titleIcon?: string;
    textIcon?: string;
};

export type SubscribeForm = {
    action: string;
    emailFieldName?: string;
    hiddenFields?: { name: string; value: string }[];
    honeypotFieldName?: string;
};

export type Subscribe = {
    enabled?: boolean;
    title?: string;
    text?: string;
    form?: SubscribeForm;
};

export type SplashConfig = {
    enabled?: boolean;
    backgroundImage?: string | string[];
    overlay?: string;
    textShadow?: boolean;
    /** 无背景图时的 fallback 背景色，默认 bg-main */
    fallbackBg?: string;
    /** 底部渐变末尾颜色，默认跟随主题色 */
    gradientColor?: string;
    /** 底部渐变高度，默认 h-56 */
    gradientHeight?: string;
    /** 底部渐变毛玻璃模糊强度，默认 12px */
    backdropBlur?: string;
    /** 轮播图单张停留时长（秒），默认 18 */
    slideDuration?: number;
    title?: string;
    subtitle?: string;
    description?: string;
    nav?: { text: string; href: string; icon?: string }[];
};

export type FontConfig = {
    display?: string;
    body?: string;
    ui?: string;
    mono?: string;
};

export type SiteConfig = {
    website: string;
    fonts: FontConfig;
    avatar?: ImageInput;
    title: string;
    subtitle?: string;
    description: string;
    image?: ImageInput;
    headerNavLinks?: NavItem[];
    footerNavLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
    comments?: {
        enabled: boolean;
        provider: 'giscus' | 'artalk';
        giscus?: {
            repo: string;
            repoId: string;
            category: string;
            categoryId: string;
            mapping?: 'pathname' | 'url' | 'title' | 'og:title';
            strict?: boolean;
            reactionsEnabled?: boolean;
            emitMetadata?: boolean;
            inputPosition?: 'top' | 'bottom';
            theme?: string;
            lang?: string;
            loading?: 'lazy' | 'eager';
        };
        artalk?: {
            server: string;
            site?: string;
        };
    };
    splash?: SplashConfig;
    agent?: AgentConfig;
    views?: {
        default: { name: string; path: string };
        resume: { name: string; path: string };
        minimal: { name: string; path: string; enabled?: boolean };
    };
    links?: SiteConfigLinks;
    /** 网站卡片封面截图服务，默认 thumio */
    screenshotService?: 'thumio' | 'mshots';
    sidebar?: SidebarConfig;
    floatingAudio?: {
        enabled: boolean;
        autoplay?: boolean;
    };
};

export type AgentProvider = 'rive' | 'live2d';

export type AgentConfig = {
    enabled?: boolean;
    provider: AgentProvider;
    name?: string;
    rive?: {
        src: string;
        stateMachine?: string;
    };
    live2d?: {
        modelPath: string;
    };
};

export type Album = {
    id: string;
    title: string;
    description?: string;
    cover?: ImageInput;
    images: ImageInput[];
    date?: Date;
    tags?: string[];
};

export type SidebarComponentConfig = {
    recentPosts?: { limit?: number };
    featured?: { limit?: number };
    tags?: { limit?: number };
    related?: { limit?: number };
    welcome?: { text?: string };
    ghCard?: {
        mode: 'repo' | 'user';
        repo?: string;
        user?: string;
        bio?: string;
    };
};

export type SidebarNavItem = {
    label: string;
    href: string;
    icon: string;
};

export type SidebarConfig = {
    left?: string[];
    right?: string[];
    postRight?: string[];
    docRight?: string[];
    components?: SidebarComponentConfig;
    nav?: SidebarNavItem[];
};
