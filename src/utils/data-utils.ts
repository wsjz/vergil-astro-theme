import { type CollectionEntry } from 'astro:content';
import { slugify } from './common-utils';

export function sortItemsByDateDesc(itemA: CollectionEntry<'blog' | 'projects'>, itemB: CollectionEntry<'blog' | 'projects'>) {
    return new Date(itemB.data.publishDate).getTime() - new Date(itemA.data.publishDate).getTime();
}

export function getAllTags(posts: CollectionEntry<'blog'>[]) {
    const tags: string[] = [...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean))];
    return tags
        .map((tag) => {
            return {
                name: tag,
                id: slugify(tag)
            };
        })
        .filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
        });
}

export function getPostsByTag(posts: CollectionEntry<'blog'>[], tagId: string) {
    const filteredPosts: CollectionEntry<'blog'>[] = posts.filter((post) => (post.data.tags || []).map((tag) => slugify(tag)).includes(tagId));
    return filteredPosts;
}

export function getAllCategories(posts: CollectionEntry<'blog'>[]) {
    const categories = [...new Set(posts.map((post) => post.data.category).filter(Boolean))] as string[];
    return categories.map((cat) => ({
        name: cat,
        id: slugify(cat)
    }));
}

export function getPostsByCategory(posts: CollectionEntry<'blog'>[], categoryId: string) {
    return posts.filter((post) => post.data.category && slugify(post.data.category) === categoryId);
}

export function getAllSeries(posts: CollectionEntry<'blog'>[]) {
    const series = [...new Set(posts.map((p) => p.data.series).filter(Boolean))] as string[];
    return series.map((s) => ({ name: s, id: slugify(s) }));
}

export function getPostsBySeries(posts: CollectionEntry<'blog'>[], seriesId: string) {
    return posts
        .filter((p) => p.data.series && slugify(p.data.series) === seriesId)
        .sort((a, b) => new Date(a.data.publishDate).getTime() - new Date(b.data.publishDate).getTime());
}
