import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
    const posts = await getCollection('blog');
    const projects = await getCollection('projects');

    const searchData = [
        ...posts.map(post => ({
            id: post.id,
            title: post.data.title,
            excerpt: post.data.excerpt || '',
            content: post.body?.slice(0, 500) || '',
            type: 'post',
            date: post.data.publishDate,
            tags: post.data.tags || []
        })),
        ...projects.map(project => ({
            id: project.id,
            title: project.data.title,
            description: project.data.description || '',
            content: project.body?.slice(0, 500) || '',
            type: 'project',
            date: project.data.publishDate,
            tags: []
        }))
    ];

    return new Response(JSON.stringify(searchData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};