import { getCollection, type CollectionEntry } from 'astro:content';

export type DocArticleNode = {
    type: 'article';
    title: string;
    slug: string;
    order: number;
    entry: CollectionEntry<'docs'>;
};

export type DocGroupNode = {
    type: 'group';
    title: string;
    dirPath: string;
    order: number;
    children: DocTreeNode[];
    slug?: string; // index.md slug, if present
};

export type DocTreeNode = DocArticleNode | DocGroupNode;

export type DocSet = {
    id: string;
    meta: CollectionEntry<'docs'>;
    tree: DocTreeNode[];
};

function stripOrderPrefix(name: string): string {
    return name.replace(/^\d+[-_]/, '');
}

function isMetaEntry(entry: CollectionEntry<'docs'>): boolean {
    return entry.id.endsWith('/_meta') || entry.id === '_meta';
}

function getDocId(entryId: string): string {
    const idx = entryId.indexOf('/');
    return idx === -1 ? entryId : entryId.slice(0, idx);
}

export async function getDocSets(): Promise<DocSet[]> {
    const entries = await getCollection('docs');
    const grouped = new Map<string, CollectionEntry<'docs'>[]>();
    for (const entry of entries) {
        const docId = getDocId(entry.id);
        if (!grouped.has(docId)) grouped.set(docId, []);
        grouped.get(docId)!.push(entry);
    }
    const sets: DocSet[] = [];
    for (const [id, groupEntries] of grouped) {
        const meta = groupEntries.find(isMetaEntry);
        if (!meta) continue;
        const tree = buildTree(id, groupEntries, meta.data?.dirs as Record<string, string> | undefined);
        sets.push({ id, meta, tree });
    }
    sets.sort((a, b) => ((a.meta.data?.order as number) ?? 99) - ((b.meta.data?.order as number) ?? 99));
    return sets;
}

export async function getDocTree(docId: string): Promise<DocTreeNode[]> {
    const entries = await getCollection('docs');
    const groupEntries = entries.filter((e) => getDocId(e.id) === docId);
    const meta = groupEntries.find(isMetaEntry);
    if (!meta) return [];
    return buildTree(docId, groupEntries, meta.data?.dirs as Record<string, string> | undefined);
}

export async function getDocEntry(docId: string, slug: string): Promise<CollectionEntry<'docs'> | undefined> {
    const entries = await getCollection('docs');
    const expectedId = `${docId}/${slug}`;
    return entries.find((e) => !isMetaEntry(e) && (e.id === expectedId || e.id === `${expectedId}/index`));
}

export async function getFirstDocSlug(docId: string): Promise<string | undefined> {
    const tree = await getDocTree(docId);
    const node = findFirstArticle(tree);
    return node?.slug;
}

export async function getAdjacentDocs(
    docId: string,
    slug: string
): Promise<{ prev: DocArticleNode | null; next: DocArticleNode | null }> {
    const tree = await getDocTree(docId);
    const flat: DocArticleNode[] = [];
    flattenTree(tree, flat);
    const idx = flat.findIndex((n) => n.slug === slug);
    if (idx === -1) return { prev: null, next: null };
    return {
        prev: idx > 0 ? flat[idx - 1] : null,
        next: idx < flat.length - 1 ? flat[idx + 1] : null
    };
}

function flattenTree(nodes: DocTreeNode[], out: DocArticleNode[]) {
    for (const node of nodes) {
        if (node.type === 'article') {
            out.push(node);
        } else {
            flattenTree(node.children, out);
        }
    }
}

function findFirstArticle(nodes: DocTreeNode[]): DocArticleNode | undefined {
    for (const node of nodes) {
        if (node.type === 'article') return node;
        const found = findFirstArticle(node.children);
        if (found) return found;
    }
    return undefined;
}

function buildTree(
    docId: string,
    entries: CollectionEntry<'docs'>[],
    dirs: Record<string, string> | undefined
): DocTreeNode[] {
    const dirOrderMap = new Map<string, number>();
    if (dirs) {
        Object.keys(dirs).forEach((k, i) => dirOrderMap.set(k, i));
    }
    const articles = entries.filter((e) => !isMetaEntry(e));
    const root: DocTreeNode[] = [];
    for (const entry of articles) {
        const relativeId = entry.id.slice(docId.length + 1);
        const segments = relativeId.split('/');
        insertNode(root, segments, entry, '', dirOrderMap, dirs);
    }
    dedupeIndexArticles(root);
    sortNodes(root, dirOrderMap);
    return root;
}

function insertNode(
    nodes: DocTreeNode[],
    segments: string[],
    entry: CollectionEntry<'docs'>,
    parentPath: string,
    dirOrderMap: Map<string, number>,
    dirs: Record<string, string> | undefined
) {
    if (segments.length === 1) {
        nodes.push({
            type: 'article',
            title: entry.data.title as string,
            slug: entry.id.split('/').slice(1).join('/').replace(/\/index$/, ''),
            order: (entry.data.order as number) ?? 99,
            entry
        });
        return;
    }
    const dirName = segments[0];
    const currentPath = parentPath ? `${parentPath}/${dirName}` : dirName;
    let group = nodes.find((n): n is DocGroupNode => n.type === 'group' && n.dirPath === currentPath);
    if (!group) {
        group = {
            type: 'group',
            title: dirs?.[currentPath] ?? stripOrderPrefix(dirName),
            dirPath: currentPath,
            order: dirOrderMap.get(currentPath) ?? 99,
            children: []
        };
        nodes.push(group);
    }
    insertNode(group.children, segments.slice(1), entry, currentPath, dirOrderMap, dirs);
}

function dedupeIndexArticles(nodes: DocTreeNode[]) {
    const toRemove: number[] = [];

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (node.type === 'group') {
            dedupeIndexArticles(node.children);
        }

        if (node.type === 'article') {
            // 查找同层级是否有 dirPath 等于 article.slug 的 group
            const groupIdx = nodes.findIndex(
                (n, idx) => idx !== i && n.type === 'group' && n.dirPath === node.slug
            );
            if (groupIdx !== -1) {
                const group = nodes[groupIdx] as DocGroupNode;
                group.slug = node.slug;
                if (node.order < group.order) group.order = node.order;
                toRemove.push(i);
            }
        }
    }

    // 从后往前删除，避免索引偏移
    toRemove.sort((a, b) => b - a);
    for (const idx of toRemove) {
        nodes.splice(idx, 1);
    }
}

function sortNodes(nodes: DocTreeNode[], dirOrderMap: Map<string, number>) {
    nodes.sort((a, b) => {
        const orderA = a.type === 'group' ? (dirOrderMap.get(a.dirPath) ?? a.order) : a.order;
        const orderB = b.type === 'group' ? (dirOrderMap.get(b.dirPath) ?? b.order) : b.order;
        if (orderA !== orderB) return orderA - orderB;
        // tie-breaker: articles before groups, then by title
        if (a.type !== b.type) return a.type === 'article' ? -1 : 1;
        return a.title.localeCompare(b.title);
    });
    for (const node of nodes) {
        if (node.type === 'group') {
            sortNodes(node.children, dirOrderMap);
        }
    }
}
