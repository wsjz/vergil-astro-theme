import { visit } from 'unist-util-visit';
import { escapeHtml } from './shared.mjs';

/** Extract raw text content from directive children */
function extractText(children) {
    let text = '';
    visit({ type: 'root', children }, 'text', (t) => {
        text += t.value;
    });
    return text;
}

/** Extract text from code blocks or plain text children */
function extractRawContent(children) {
    for (const child of children) {
        if (child.type === 'code') {
            return child.value || '';
        }
    }
    return extractText(children);
}

/** Normalize smart/curly quotes back to straight quotes for JSON parsing */
function normalizeQuotes(text) {
    return text
        .replace(/\u201C/g, '"')
        .replace(/\u201D/g, '"')
        .replace(/\u2018/g, "'")
        .replace(/\u2019/g, "'");
}

/** Process chart directives (mermaid / echart) */
export function processChartDirective(node) {
    const name = node.name;
    const attrs = node.attributes || {};
    const rawText = extractRawContent(node.children).trim();

    switch (name) {
        case 'mermaid': {
            const uid = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
            node.data = {
                hName: 'div',
                hProperties: {
                    class: 'md-directive md-directive-mermaid',
                    'data-mermaid': '1',
                    'data-mermaid-id': uid,
                },
            };
            node.children = [
                {
                    type: 'html',
                    value: `<pre class="md-mermaid-source" style="display:none;">${escapeHtml(rawText)}</pre><div class="md-mermaid-output"></div>`,
                },
            ];
            break;
        }

        case 'echart': {
            const uid = `echart-${Math.random().toString(36).slice(2, 9)}`;
            const height = attrs.height || '400px';
            let option = {};
            try {
                const normalizedText = normalizeQuotes(rawText);
                option = JSON.parse(normalizedText);
            } catch (e) {
                node.data = {
                    hName: 'div',
                    hProperties: { class: 'md-directive md-directive-echart md-echart-error' },
                };
                node.children = [
                    {
                        type: 'html',
                        value: `<div class="md-echart-error-msg">ECharts 配置解析失败: ${escapeHtml(e.message)}</div>`,
                    },
                ];
                return;
            }

            node.data = {
                hName: 'div',
                hProperties: {
                    class: 'md-directive md-directive-echart',
                    'data-echart': '1',
                    'data-echart-id': uid,
                    style: `--echart-height:${height}`,
                },
            };
            const safeOption = escapeHtml(JSON.stringify(option));
            node.children = [
                {
                    type: 'html',
                    value: `<div class="md-echart-container" style="height:${height}" data-option="${safeOption}"></div>`,
                },
            ];
            break;
        }

        default:
            break;
    }
}
