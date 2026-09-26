import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

function getDocUrl(id: string): string {
    const parts = id.split('/');
    const docId = parts[0];
    const slug = parts.slice(1).join('/').replace(/\/index$/, '');
    return `/docs/${docId}/${slug}/`;
}

/**
 * 正文里的 Markdown 和指令语法对搜索没有价值，还会稀释匹配。
 * 这里把它们剥掉，只留可读的文字，索引因此也小一些。
 */
function toPlainText(body: string): string {
    return body
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/^:{3,}\w*\{[^}]*\}\s*$/gm, ' ')
        .replace(/^:{3,}\s*$/gm, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/[*_`>|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * 单条正文的上限。不做截断的话，个别超长示例文章会把索引撑大；
 * 但上限必须远高于正文的常见长度，否则文章中后段的内容就搜不到——
 * 之前这里是 2000，等于只索引了开头一小段。
 */
const MAX_CONTENT = 20000;

const entry = (o: Record<string, unknown>) => ({ date: null, tags: [], ...o });

export const GET: APIRoute = async () => {
    const posts = await getCollection('blog', ({ data }) => !data.draft);
    const projects = await getCollection('projects');
    const docs = await getCollection('docs', ({ data }) => !data.draft);
    const thoughts = await getCollection('thoughts');
    const albums = await getCollection('albums');
    const series = await getCollection('series');
    const pages = await getCollection('pages');

    // 动态是散落的 JSON 文件，不是内容集合，只能直接读目录
    const momentsDir = path.join(process.cwd(), 'src', 'content', 'moments');
    const moments: { date: string; content: string; tags?: string[] }[] = [];
    if (fs.existsSync(momentsDir)) {
        for (const file of fs.readdirSync(momentsDir).filter((f) => f.endsWith('.json'))) {
            try {
                moments.push(JSON.parse(fs.readFileSync(path.join(momentsDir, file), 'utf-8')));
            } catch {
                /* 坏掉的单条不该让整个索引构建失败 */
            }
        }
    }

    const searchData = [
        ...posts.map((post) =>
            entry({
                id: post.id,
                title: post.data.title,
                description: post.data.excerpt || '',
                content: toPlainText(post.body || '').slice(0, MAX_CONTENT),
                type: 'post',
                date: post.data.publishDate,
                tags: post.data.tags || []
            })
        ),
        ...projects.map((project) =>
            entry({
                id: project.id,
                title: project.data.title,
                description: project.data.description || '',
                content: toPlainText(project.body || '').slice(0, MAX_CONTENT),
                type: 'project',
                date: project.data.publishDate
            })
        ),
        ...docs
            .filter((doc) => !doc.id.endsWith('/_meta') && doc.id !== '_meta')
            .map((doc) =>
                entry({
                    id: doc.id,
                    url: getDocUrl(doc.id),
                    title: doc.data.title,
                    description: doc.data.excerpt || doc.data.description || '',
                    content: toPlainText(doc.body || '').slice(0, MAX_CONTENT),
                    type: 'doc',
                    tags: doc.data.tags || []
                })
            ),
        // 想法和动态都只有列表页，没有独立路由，所以统一指向列表页
        ...thoughts.map((thought) =>
            entry({
                id: thought.id,
                url: '/thoughts/',
                title: toPlainText(thought.body || '').slice(0, 40),
                description: '',
                content: toPlainText(thought.body || '').slice(0, MAX_CONTENT),
                type: 'thought',
                date: thought.data.date,
                tags: thought.data.tags || []
            })
        ),
        ...moments.map((moment, i) =>
            entry({
                id: `moment-${i}`,
                url: '/moments/',
                title: (moment.content || '').replace(/\s+/g, ' ').slice(0, 40),
                description: '',
                content: (moment.content || '').replace(/\s+/g, ' ').slice(0, MAX_CONTENT),
                type: 'moment',
                date: moment.date,
                tags: moment.tags || []
            })
        ),
        ...albums.map((album) =>
            entry({
                id: album.id,
                url: `/albums/${album.id}/`,
                title: album.data.title,
                description: album.data.description || '',
                content: toPlainText(album.body || '').slice(0, MAX_CONTENT),
                type: 'album',
                date: album.data.date,
                tags: album.data.tags || []
            })
        ),
        ...series.map((s) =>
            entry({
                id: s.id,
                url: `/series/${s.id}/`,
                title: s.data.name,
                description: s.data.description || '',
                content: toPlainText(s.body || '').slice(0, MAX_CONTENT),
                type: 'series'
            })
        ),
        ...pages.map((page) =>
            entry({
                id: page.id,
                url: `/${page.id}/`,
                title: page.data.title,
                description: page.data.seo?.description || '',
                content: toPlainText(page.body || '').slice(0, MAX_CONTENT),
                type: 'page'
            })
        )
    ];

    return new Response(JSON.stringify(searchData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
