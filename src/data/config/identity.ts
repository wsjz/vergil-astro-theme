export const siteInfo = {
    title: 'Vergil',
    /** 主题界面文案的语言，也决定 <html lang> 和日期格式。可选 'zh-CN' | 'en' */
    locale: 'zh-CN',
    subtitle: 'Astro Framework for Content Creators',
    description: 'A content-driven Astro framework for building personal websites with Markdown',
    image: {
        src: '/vergil-preview.jpg',
        alt: 'Vergil - Astro.js and Tailwind CSS theme'
    },
    /**
     * 备案信息，中国大陆站点用。每一项可以只写文字，也可以带跳转链接。
     * 留空则左侧栏不显示备案区块。
     *
     * 备案号与主体身份绑定，不要填别人的。示例：
     *   icp: [
     *       { text: '京ICP备00000000号-1', href: 'https://beian.miit.gov.cn/' },
     *       { text: '京公网安备00000000000000号', href: 'https://beian.mps.gov.cn/' },
     *   ],
     */
    /**
     * 左侧栏底部的社交图标。改成你自己的地址；留空这个图标就不显示。
     */
    socials: {
        github: 'https://github.com/wsjz/vergil-astro-theme',
    },

    icp: [] as Array<{ text: string; href?: string }>,
};

/**
 * 首页顶部的介绍区。
 *
 * 这里默认介绍的是 Vergil 本身——因为这个站同时也是主题的演示站。
 * 换成你自己的站点时，把下面改成你的自我介绍就行。
 */
export const heroData = {
    title: '用 **Markdown** 写，交给 **Vergil** 呈现',
    text: '一套面向创作者的 Astro 建站框架。50 个内容指令、多视图架构、多主题相册，全部写在 Markdown 里，不碰一行组件代码。\n\n这个站点本身就是用 Vergil 搭的，你看到的每一个效果都能在文档里找到写法。',
    titleIcon: 'Sparkles',
    textIcon: 'Zap',
    actions: [
        {
            text: '快速开始',
            href: '/docs/vergil-guide/01-快速开始/'
        },
        {
            text: '内容指令',
            href: '/docs/vergil-guide/03-基本创作/内容指令/'
        }
    ]
};

/**
 * 邮件订阅区块。默认关闭，因为它需要一个真实的表单接收地址。
 * 接好 Buttondown / Mailchimp / ConvertKit 这类服务，把 action 换成
 * 它们给的表单地址，再把 enabled 改成 true。
 */
export const subscribe = {
    enabled: false,
    title: '订阅更新',
    text: '填入你的邮件订阅服务地址后再开启。',
    form: {
        action: '#'
    }
};

export const postsPerPage = 8;
export const projectsPerPage = 8;
