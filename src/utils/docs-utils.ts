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
    slug?: string;
};

export type DocTreeNode = DocArticleNode | DocGroupNode;

export type DocSet = {
    id: string;
    meta: CollectionEntry<'docs'>;
    tree: DocTreeNode[];
};

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
        const tree = buildTree(id, groupEntries, meta.data?.dirs as any);
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
    return buildTree(docId, groupEntries, meta.data?.dirs as any);
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

export async function getDocGroup(docId: string, dirPath: string): Promise<DocGroupNode | undefined> {
    const tree = await getDocTree(docId);
    return findGroupByPath(tree, dirPath);
}

function findGroupByPath(nodes: DocTreeNode[], dirPath: string): DocGroupNode | undefined {
    for (const node of nodes) {
        if (node.type === 'group') {
            if (node.dirPath.toLowerCase() === dirPath.toLowerCase()) return node;
            const found = findGroupByPath(node.children, dirPath);
            if (found) return found;
        }
    }
    return undefined;
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

// 扁平化 dirs 数组，递归提取所有目录路径
function flattenDirs(dirs: (string | Record<string, string[] | null | undefined>)[]): { path: string; order: number }[] {
    const result: { path: string; order: number }[] = [];
    let order = 0;

    function traverse(items: (string | Record<string, string[] | null | undefined>)[], parentPath: string) {
        for (const item of items) {
            if (typeof item === 'string') {
                const path = parentPath ? `${parentPath}/${item}` : item;
                result.push({ path, order: order++ });
            } else if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                for (const [key, children] of Object.entries(item)) {
                    const path = parentPath ? `${parentPath}/${key}` : key;
                    result.push({ path, order: order++ });
                    if (Array.isArray(children)) {
                        traverse(children as (string | Record<string, string[] | null | undefined>)[], path);
                    }
                }
            }
        }
    }

    traverse(dirs, '');
    return result;
}

function buildTree(
    docId: string,
    entries: CollectionEntry<'docs'>[],
    dirs: (string | Record<string, string[]>)[] | undefined
): DocTreeNode[] {
    const flatDirs = dirs ? flattenDirs(dirs) : [];
    const groupMap = new Map<string, DocGroupNode>();
    const dirOrderMap = new Map<string, number>();

    // 1. 为每个注册的目录创建 group 节点，标题从 index.md 读取
    // Astro glob loader 中 index.md 的 entry.id 格式为 docId/path（不带 /index 后缀）
    for (const { path, order } of flatDirs) {
        const lowerPath = path.toLowerCase();
        dirOrderMap.set(lowerPath, order);

        const indexId = `${docId}/${path}`;
        const indexEntry = entries.find((e) => e.id.toLowerCase() === indexId.toLowerCase());
        const title = (indexEntry?.data.title as string) ?? path;

        groupMap.set(lowerPath, {
            type: 'group',
            title,
            dirPath: path,
            order,
            children: []
        });
    }

    // 2. 建立 group 父子关系
    const root: DocTreeNode[] = [];
    for (const [, group] of groupMap) {
        const lastSlash = group.dirPath.lastIndexOf('/');
        const parentPath = lastSlash > 0 ? group.dirPath.slice(0, lastSlash) : '';

        if (parentPath && groupMap.has(parentPath.toLowerCase())) {
            groupMap.get(parentPath.toLowerCase())!.children.push(group);
        } else if (!parentPath) {
            root.push(group);
        }
    }

    // 3. 遍历文章，填充到对应 group
    const articles = entries.filter((e) => !isMetaEntry(e));

    for (const entry of articles) {
        const relativeId = entry.id.slice(docId.length + 1);
        const lowerRelativeId = relativeId.toLowerCase();

        // 计算 groupPath：
        // - index.md 的 entry.id 格式为 docId/dir（不带 /index 后缀）
        //   如果 relativeId 对应一个已注册的目录，说明这是 index.md
        // - 普通文件的 entry.id 格式为 docId/dir/file
        let groupPath = '';
        if (groupMap.has(lowerRelativeId)) {
            // index.md：relativeId 本身就是目录路径
            groupPath = lowerRelativeId;
        } else {
            const segments = relativeId.split('/');
            if (segments.length > 1) {
                groupPath = segments.slice(0, -1).join('/').toLowerCase();
            }
        }

        // 未在 dirs 中注册的目录，文章不显示
        if (groupPath && !groupMap.has(groupPath)) {
            continue;
        }

        const slug = relativeId;
        const articleNode: DocArticleNode = {
            type: 'article',
            title: entry.data.title as string,
            slug,
            order: (entry.data.order as number) ?? 99,
            entry
        };

        if (groupPath && groupMap.has(groupPath)) {
            const group = groupMap.get(groupPath)!;

            // index.md 的 entry.id 格式为 docId/groupPath（不带 /index 后缀）
            const isIndex = lowerRelativeId === groupPath;
            if (isIndex) {
                group.slug = slug;
                if (articleNode.order < group.order) {
                    group.order = articleNode.order;
                }
            } else {
                group.children.push(articleNode);
            }
        } else {
            root.push(articleNode);
        }
    }

    // 4. 排序
    sortNodes(root, dirOrderMap);

    return root;
}

function sortNodes(nodes: DocTreeNode[], dirOrderMap: Map<string, number>) {
    nodes.sort((a, b) => {
        const orderA = a.type === 'group' ? (dirOrderMap.get(a.dirPath) ?? a.order) : a.order;
        const orderB = b.type === 'group' ? (dirOrderMap.get(b.dirPath) ?? b.order) : b.order;
        if (orderA !== orderB) return orderA - orderB;
        if (a.type !== b.type) return a.type === 'article' ? -1 : 1;
        return a.title.localeCompare(b.title);
    });
    for (const node of nodes) {
        if (node.type === 'group') {
            sortNodes(node.children, dirOrderMap);
        }
    }
}
