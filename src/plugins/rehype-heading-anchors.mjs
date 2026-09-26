import { visit } from 'unist-util-visit';

/**
 * 给文章标题加可点击的锚点链接。
 *
 * Astro 自己会给 h2-h4 生成 id，但没有可点的链接，读者没法复制某一节的地址。
 * 这里在标题末尾补一个 <a>，默认透明，hover 或键盘聚焦时才显现。
 * 不引入 rehype-autolink-headings，避免为一个小功能多一个依赖。
 */
const LINK_ICON = {
    type: 'element',
    tagName: 'svg',
    properties: {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '0.8em',
        height: '0.8em',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
    },
    children: [
        { type: 'element', tagName: 'path', properties: { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }, children: [] },
        { type: 'element', tagName: 'path', properties: { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }, children: [] },
    ],
};

function textOf(node) {
    let out = '';
    visit(node, 'text', (t) => {
        out += t.value;
    });
    return out.trim();
}

export function rehypeHeadingAnchors(options = {}) {
    const anchorTo = options.anchorTo ?? '链接到：';
    const anchorToHeading = options.anchorToHeading ?? '链接到此标题';
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (!/^h[2-4]$/.test(node.tagName)) return;

            const id = node.properties?.id;
            if (!id) return;

            // 已经加过就跳过，避免重复运行时叠加
            if (node.children?.some((c) => c.type === 'element' && c.properties?.className?.includes?.('heading-anchor'))) {
                return;
            }

            const label = textOf(node);
            node.children.push({
                type: 'element',
                tagName: 'a',
                properties: {
                    href: `#${id}`,
                    className: ['heading-anchor'],
                    'aria-label': label ? `${anchorTo}${label}` : anchorToHeading,
                },
                children: [structuredClone(LINK_ICON)],
            });
        });
    };
}
