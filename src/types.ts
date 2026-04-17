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
    backgroundImage?: string;
    title?: string;
    subtitle?: string;
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
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
    search?: {
        enabled: boolean;
    };
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
    albums?: {
        enabled: boolean;
    };
    splash?: SplashConfig;
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
