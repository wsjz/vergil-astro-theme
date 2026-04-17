import { visit } from 'unist-util-visit';

export function rehypeTitleHeadings() {
    return (tree, file) => {
        const existing = file.data?.astro?.headings || [];
        const existingBySlug = new Map(existing.map((h) => [h.slug, h]));

        visit(tree, 'element', (node) => {
            const tag = node.tagName;
            if (!/^h[2-4]$/i.test(tag)) return;
            const classes = node.properties?.className || [];
            if (!classes.includes('md-title')) return;

            const slug = node.properties?.id || '';
            if (!slug) return;

            let text = '';
            visit(node, 'text', (t, _index, parent) => {
                const parentClass = parent?.properties?.className || [];
                const pClasses = Array.isArray(parentClass) ? parentClass : [parentClass];
                if (!pClasses.includes('md-title-text')) return;
                text += t.value;
            });
            text = text.trim();
            if (!text) return;

            const depth = parseInt(tag[1], 10);
            const prev = existingBySlug.get(slug);
            if (prev) {
                prev.text = text;
                prev.depth = depth;
            } else {
                existing.push({ depth, slug, text });
                existingBySlug.set(slug, existing[existing.length - 1]);
            }
        });

        if (!file.data) file.data = {};
        if (!file.data.astro) file.data.astro = {};
        file.data.astro.headings = existing;
    };
}
