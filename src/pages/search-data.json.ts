import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

function getDocUrl(id: string): string {
    const parts = id.split('/');
    const docId = parts[0];
    const slug = parts.slice(1).join('/').replace(/\/index$/, '');
    return `/docs/${docId}/${slug}/`;
}

export const GET: APIRoute = async () => {
    const posts = await getCollection('blog', ({ data }) => !data.draft);
    const projects = await getCollection('projects');
    const docs = await getCollection('docs', ({ data }) => !data.draft);

    const searchData = [
        ...posts.map(post => ({
            id: post.id,
            title: post.data.title,
            description: post.data.excerpt || '',
            content: post.body?.slice(0, 2000) || '',
            type: 'post',
            date: post.data.publishDate,
            tags: post.data.tags || []
        })),
        ...projects.map(project => ({
            id: project.id,
            title: project.data.title,
            description: project.data.description || '',
            content: project.body?.slice(0, 2000) || '',
            type: 'project',
            date: project.data.publishDate,
            tags: []
        })),
        ...docs
            .filter(doc => !doc.id.endsWith('/_meta') && doc.id !== '_meta')
            .map(doc => ({
                id: doc.id,
                url: getDocUrl(doc.id),
                title: doc.data.title,
                description: doc.data.excerpt || doc.data.description || '',
                content: doc.body?.slice(0, 2000) || '',
                type: 'doc',
                date: null,
                tags: doc.data.tags || []
            }))
    ];

    return new Response(JSON.stringify(searchData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
