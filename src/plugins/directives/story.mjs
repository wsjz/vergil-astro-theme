/**
 * :::story directive — row-based storyboard rendering.
 *
 * Fixed column semantics: shot (required), image, desc, dialogue, note.
 * Any other column becomes a tag.
 */

import { escapeHtml } from './shared.mjs';

const KNOWN_COLS = new Set(['shot', 'image', 'desc', 'dialogue', 'note']);

function extractTextFromCell(cell) {
    let text = '';
    function walk(children) {
        for (const child of children || []) {
            if (child.type === 'text') text += child.value || '';
            else if (child.type === 'inlineCode') text += child.value || '';
            else if (child.type === 'textDirective') text += ':' + (child.name || '');
            else if (child.children) walk(child.children);
        }
    }
    walk(cell.children);
    return text.trim();
}

function extractImageUrl(cell) {
    // Look for image node inside cell
    if (!cell.children) return null;
    for (const child of cell.children) {
        if (child.type === 'image') return child.url || null;
        if (child.type === 'paragraph' && child.children) {
            for (const gchild of child.children) {
                if (gchild.type === 'image') return gchild.url || null;
            }
        }
    }
    // Fallback: plain text URL
    const text = extractTextFromCell(cell);
    if (text && (text.startsWith('http') || text.startsWith('/'))) return text;
    return null;
}

function parseStoryTable(node) {
    const tableNode = node.children.find(c => c.type === 'table');
    if (!tableNode) return { columns: [], rows: [] };

    const headerRow = tableNode.children.find(c => c.type === 'tableRow');
    if (!headerRow) return { columns: [], rows: [] };

    const columns = headerRow.children
        .filter(c => c.type === 'tableCell')
        .map(cell => extractTextFromCell(cell).toLowerCase().trim());

    if (!columns.includes('shot')) {
        return { columns, rows: [], error: ':::story directive requires a "shot" column' };
    }

    const rows = [];
    let foundHeader = false;
    for (const row of tableNode.children) {
        if (row.type !== 'tableRow') continue;
        if (!foundHeader) { foundHeader = true; continue; }

        const cells = row.children.filter(c => c.type === 'tableCell');
        const rowData = {};
        cells.forEach((cell, i) => {
            const colName = columns[i] || `col${i}`;
            if (colName === 'image') {
                rowData[colName] = extractImageUrl(cell);
            } else {
                rowData[colName] = extractTextFromCell(cell);
            }
        });
        rows.push(rowData);
    }

    return { columns, rows };
}

function renderStoryHtml(data) {
    const { columns, rows, error } = data;
    if (error) {
        return `<div class="md-directive md-directive-story"><p class="md-story-error">${escapeHtml(error)}</p></div>`;
    }
    if (rows.length === 0) {
        return '<div class="md-directive md-directive-story"><p class="md-story-empty">暂无分镜内容</p></div>';
    }

    const tagCols = columns.filter(c => !KNOWN_COLS.has(c));

    let html = '<div class="md-directive md-directive-story">';

    for (const row of rows) {
        html += '<div class="md-story-shot">';

        // Shot number
        html += `<span class="md-story-number">${escapeHtml(row.shot || '')}</span>`;
        html += '<div class="md-story-divider"></div>';

        // Optional image
        if (row.image) {
            html += '<div class="md-story-image">';
            html += `<img src="${escapeHtml(row.image)}" alt="" loading="lazy" decoding="async">`;
            html += '</div>';
        }

        // Body
        html += '<div class="md-story-body">';

        // Tags (any non-known column with non-empty value)
        const tags = [];
        for (const col of tagCols) {
            const val = row[col];
            if (val) tags.push({ col, val });
        }
        if (tags.length > 0) {
            html += '<div class="md-story-tags">';
            for (const { col, val } of tags) {
                html += `<span class="md-story-tag" data-tag="${escapeHtml(col)}">${escapeHtml(col)}: ${escapeHtml(val)}</span>`;
            }
            html += '</div>';
        }

        // Description
        if (row.desc) {
            html += `<div class="md-story-desc">${escapeHtml(row.desc)}</div>`;
        }

        // Dialogue
        if (row.dialogue) {
            html += `<div class="md-story-dialogue">${escapeHtml(row.dialogue)}</div>`;
        }

        // Note
        if (row.note) {
            html += `<div class="md-story-note">${escapeHtml(row.note)}</div>`;
        }

        html += '</div>'; // .md-story-body
        html += '</div>'; // .md-story-shot
    }

    html += '</div>';
    return html;
}

export function processStoryDirective(node, options = {}) {
    const data = parseStoryTable(node);
    const html = renderStoryHtml(data);

    node.data = { hName: 'div', hProperties: {} };
    node.children = [{ type: 'html', value: html }];
}
