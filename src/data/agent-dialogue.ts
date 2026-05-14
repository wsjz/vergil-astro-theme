/**
 * Site Agent dialogue config
 * Route-aware greetings and idle chatter
 */

export interface DialogueLine {
    text: string;
}

export interface RouteDialogue {
    match: RegExp;
    lines: DialogueLine[];
    idleLines?: DialogueLine[];
}

/** Home page */
const homeDialogue: RouteDialogue = {
    match: /^\/$/,
    lines: [
        { text: '欢迎来到我的个人网站！我是 Miki' },
        { text: '你可以看看最近的文章，或者去知识库逛逛～' },
        { text: '点击左上角可以切换深色模式，晚上看更舒服哦' },
    ],
    idleLines: [
        { text: '有什么想了解的直接问我吧！' },
        { text: '这里的文章都是用心写的，希望对你有帮助～' },
        { text: '要不要看看我的项目作品集？' },
    ],
};

/** Blog post list */
const blogDialogue: RouteDialogue = {
    match: /^\/blog/,
    lines: [
        { text: '这里是文章列表，按时间倒序排列的' },
        { text: '你可以用顶部的搜索框快速查找文章哦' },
        { text: '看到感兴趣的话题就点进去看看吧～' },
    ],
    idleLines: [
        { text: '最近有篇新文章，要不要看看？' },
        { text: '写文章是个整理思路的好方法呢' },
    ],
};

/** Single article */
const articleDialogue: RouteDialogue = {
    match: /^\/(blog|docs)\/[^/]+$/,
    lines: [
        { text: '正在阅读文章吗？慢慢看，不着急' },
        { text: '左侧目录可以帮你快速定位到感兴趣的章节' },
        { text: '觉得有用的话别忘了收藏哦～' },
    ],
    idleLines: [
        { text: '读到精彩的地方了吗？' },
        { text: ' technical 文章有时候需要多读几遍才能理解' },
    ],
};

/** Docs / Knowledge base */
const docsDialogue: RouteDialogue = {
    match: /^\/docs/,
    lines: [
        { text: '欢迎来到知识库！这里是系统化的学习笔记' },
        { text: '左侧有完整的目录树，可以快速跳转' },
        { text: '文档会不定期更新，建议收藏页面～' },
    ],
    idleLines: [
        { text: '学习是个持续的过程，加油！' },
        { text: '有不懂的地方欢迎评论区留言讨论' },
    ],
};

/** Projects */
const projectsDialogue: RouteDialogue = {
    match: /^\/projects/,
    lines: [
        { text: '这里是项目展示页面' },
        { text: '每个项目卡片都可以点击查看详情' },
        { text: '如果你也对某个项目感兴趣，欢迎交流！' },
    ],
    idleLines: [
        { text: '项目实践是最好的学习方式' },
        { text: '想看看源码的话可以直接点 GitHub 链接' },
    ],
};

/** Albums */
const albumsDialogue: RouteDialogue = {
    match: /^\/albums/,
    lines: [
        { text: '这里记录了一些生活中的美好瞬间' },
        { text: '点击照片可以放大查看哦' },
        { text: '拍照是我记录生活的方式～' },
    ],
    idleLines: [
        { text: '光影之间，时间便有了形状' },
        { text: '你喜欢摄影吗？' },
    ],
};

/** About */
const aboutDialogue: RouteDialogue = {
    match: /^\/about/,
    lines: [
        { text: '这是关于我的页面，算是自我介绍吧' },
        { text: '如果你好奇我是谁、在做什么，都在这里了' },
        { text: '有任何想法欢迎随时联系～' },
    ],
    idleLines: [
        { text: '认识自己是一生的功课' },
        { text: '保持好奇，保持热爱' },
    ],
};

/** Contact */
const contactDialogue: RouteDialogue = {
    match: /^\/contact/,
    lines: [
        { text: '想聊聊吗？通过下面的方式可以找到我' },
        { text: '合作、交流、或者单纯聊聊天都可以～' },
        { text: '我通常会在 24 小时内回复' },
    ],
    idleLines: [
        { text: '有朋自远方来，不亦乐乎' },
        { text: '期待与你的交流！' },
    ],
};

/** Archives */
const archivesDialogue: RouteDialogue = {
    match: /^\/archives/,
    lines: [
        { text: '这里按时间线整理了所有文章' },
        { text: '可以看看你感兴趣的月份写了什么' },
        { text: '写作是一种时间的艺术' },
    ],
    idleLines: [
        { text: '回头看看，总能发现成长' },
        { text: '有些文章现在看会有不一样的体会' },
    ],
};

/** Tags / Categories */
const tagsDialogue: RouteDialogue = {
    match: /^\/(tags|categories|series)/,
    lines: [
        { text: '按话题分类浏览，找到你感兴趣的内容' },
        { text: '同一个话题下的文章往往有关联性' },
        { text: '点击标签就可以查看该话题下的所有文章' },
    ],
    idleLines: [
        { text: '分类是知识的骨架' },
        { text: '从感兴趣的标签开始探索吧' },
    ],
};

/** All route dialogues, ordered by priority */
export const routeDialogues: RouteDialogue[] = [
    homeDialogue,
    articleDialogue, // Single article takes priority over list
    blogDialogue,
    docsDialogue,
    projectsDialogue,
    albumsDialogue,
    aboutDialogue,
    contactDialogue,
    archivesDialogue,
    tagsDialogue,
];

/** Get dialogue config for the current path */
export function getDialogueForPath(path: string): RouteDialogue {
    for (const dialogue of routeDialogues) {
        if (dialogue.match.test(path)) {
            return dialogue;
        }
    }
    return homeDialogue;
}

export const agentConfig = {
    firstVisitKey: 'agent-first-visit-v2',
    idleInterval: 20000,
    typeSpeed: 40,
} as const;
