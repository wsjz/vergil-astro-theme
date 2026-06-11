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
    const allCats = new Set<string>();
    posts.forEach((post) => {
        const cats = post.data.categories;
        if (!cats) return;
        cats.forEach((cat) => allCats.add(cat));
    });
    return [...allCats].map((cat) => ({
        name: cat,
        id: slugify(cat)
    }));
}

export function getPostsByCategory(posts: CollectionEntry<'blog'>[], categoryId: string) {
    return posts.filter((post) => {
        const cats = post.data.categories;
        if (!cats) return false;
        return cats.some((cat) => slugify(cat) === categoryId);
    });
}

// 分类树节点
export type CategoryNode = {
    name: string;
    id: string;
    count: number;
    children: CategoryNode[];
};

export function buildCategoryTree(posts: CollectionEntry<'blog'>[]): CategoryNode[] {
    const root: CategoryNode[] = [];

    posts.forEach((post) => {
        const cats = post.data.categories;
        if (!cats || cats.length === 0) return;

        let currentChildren = root;
        cats.forEach((catName) => {
            const id = slugify(catName);
            let node = currentChildren.find((n) => n.id === id);
            if (!node) {
                node = { name: catName, id, count: 0, children: [] };
                currentChildren.push(node);
            }
            node.count++;
            currentChildren = node.children;
        });
    });

    return root;
}

export function findCategoryPath(tree: CategoryNode[], targetId: string): CategoryNode[] | null {
    for (const node of tree) {
        if (node.id === targetId) {
            return [node];
        }
        if (node.children.length > 0) {
            const childPath = findCategoryPath(node.children, targetId);
            if (childPath) {
                return [node, ...childPath];
            }
        }
    }
    return null;
}

export function getAllSeries(posts: CollectionEntry<'blog'>[]) {
    const series = [...new Set(posts.map((p) => p.data.series).filter(Boolean))] as string[];
    return series.map((s) => ({ name: s, id: slugify(s) }));
}

export function getPostsBySeries(posts: CollectionEntry<'blog'>[], seriesId: string) {
    return posts
        .filter((p) => p.data.series && slugify(p.data.series) === seriesId)
        .sort((a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime());
}
