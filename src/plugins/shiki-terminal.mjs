import { visit } from 'unist-util-visit';

const copyIconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';

function parseHighlight(raw) {
    if (!raw) return new Set();
    const set = new Set();
    raw.split(',').forEach(part => {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
            for (let i = start; i <= end; i++) if (!isNaN(i)) set.add(i);
        } else {
            const n = parseInt(part.trim(), 10);
            if (!isNaN(n)) set.add(n);
        }
    });
    return set;
}

export function remarkTerminal() {
    return (tree) => {
        visit(tree, 'code', (node, index, parent) => {
            const meta = node.meta || '';
            if (!meta.includes('terminal')) return;

            const titleMatch = meta.match(/title=["']([^"']+)["']/);
            const title = titleMatch ? titleMatch[1] : 'Terminal';
            const uid = `term-${Math.random().toString(36).slice(2, 7)}`;

            const safeCode = node.value
                .replace(/&/g, '&')
                .replace(/</g, '<')
                .replace(/>/g, '>');

            const wrapperProps = { class: 'md-terminal' };
            if (meta.includes('linenos')) {
                wrapperProps['data-line-numbers'] = 'true';
            }

            const wrapper = {
                type: 'container',
                data: { hName: 'div', hProperties: wrapperProps },
                children: [
                    { type: 'html', value: `<div class="md-terminal-header"><span class="md-terminal-title">${title}</span><button class="md-copy-btn md-terminal-copy" data-copy-target="${uid}" aria-label="Copy" title="Copy">${copyIconSvg}</button></div><div class="md-terminal-body">` },
                    node,
                    { type: 'html', value: `<textarea id="${uid}" class="md-copy-source" readonly style="position:absolute;left:-9999px;opacity:0;pointer-events:none;">${safeCode}</textarea></div>` }
                ]
            };

            parent.children[index] = wrapper;
        });
    };
}

export function transformerTerminal() {
    return {
        name: 'terminal',
        pre(node) {
            const metaRaw = this.options.meta?.__raw || '';
            if (!metaRaw.includes('terminal')) return;
            if (node.properties && node.properties.style) {
                let style = String(node.properties.style);
                style = style.replace(/white-space:\s*pre-wrap;?/g, '');
                style = style.replace(/word-wrap:\s*break-word;?/g, '');
                style = style.replace(/overflow-x:\s*auto;?/g, '');
                node.properties.style = style.trim();
            }
        },
        line(node, line) {
            const metaRaw = this.options.meta?.__raw || '';
            if (!metaRaw.includes('terminal')) return;
            if (metaRaw.includes('linenos')) {
                node.properties['data-line'] = String(line);
            }
            const highlightMatch = metaRaw.match(/highlight=["']([^"']+)["']/);
            if (highlightMatch) {
                const set = parseHighlight(highlightMatch[1]);
                if (set.has(line)) {
                    this.addClassToHast(node, 'line-highlight');
                }
            }
            if (!node.children || node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }];
            }
        },
        code(node) {
            const metaRaw = this.options.meta?.__raw || '';
            if (!metaRaw.includes('terminal')) return;
            node.children = node.children.filter(child => !(child.type === 'text' && child.value === '\n'));
        }
    };
}
