/**
 * Shared Markdown table parser for plan directives.
 * Converts remark-directive AST table node → structured data.
 */

const COL_TYPE_MAP = {
  status: 'badge', state: 'badge',
  priority: 'badge',
  progress: 'percent', percent: 'percent', completion: 'percent',
  date: 'date', start: 'date', end: 'date', deadline: 'date',
};

const STATUS_VALUES = new Set(['todo', 'doing', 'done', 'pending', 'in-progress', 'completed', 'blocked']);
const PRIORITY_VALUES = new Set(['high', 'medium', 'low', 'urgent', 'normal']);

/**
 * Parse a table node from remark-directive AST.
 *
 * @param {object} node — containerDirective node whose children contain a table
 * @param {string[]} [explicitColumns] — optional semantic column names from `columns` attr
 * @returns {{columns: string[], rows: Record<string, string>[], colTypes: Record<string, string>}}
 */
export function parseTable(node, explicitColumns = []) {
  const tableNode = findTableNode(node);
  if (!tableNode) {
    return { columns: [], rows: [], colTypes: {} };
  }

  // Extract header cells
  const headerRow = tableNode.children.find(c => c.type === 'tableRow');
  if (!headerRow) return { columns: [], rows: [], colTypes: {} };

  const rawHeaders = headerRow.children
    .filter(c => c.type === 'tableCell')
    .map(c => extractText(c).trim().toLowerCase());

  // Map to semantic column names
  const columns = rawHeaders.map((h, i) => {
    if (explicitColumns[i]) return explicitColumns[i];
    return h;
  });

  // Infer column types
  const colTypes = {};
  for (let i = 0; i < columns.length; i++) {
    const name = columns[i].toLowerCase();
    colTypes[columns[i]] = COL_TYPE_MAP[name] || inferTypeFromValues(name, tableNode, i);
  }

  // Extract data rows (skip header)
  const rows = [];
  let skipFirst = true;
  for (const child of tableNode.children) {
    if (child.type !== 'tableRow') continue;
    if (skipFirst) { skipFirst = false; continue; }

    const cells = child.children
      .filter(c => c.type === 'tableCell')
      .map(c => extractText(c).trim());

    const row = {};
    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = cells[i] !== undefined ? cells[i] : '';
    }
    rows.push(row);
  }

  return { columns, rows, colTypes };
}

function findTableNode(node) {
  if (node.type === 'table') return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findTableNode(child);
      if (found) return found;
    }
  }
  return null;
}

function extractText(node) {
  if (node.type === 'text') return node.value || '';
  if (node.type === 'inlineCode') return node.value || '';
  if (node.children) return node.children.map(extractText).join('');
  return '';
}

function inferTypeFromValues(colName, tableNode, colIndex) {
  // Check data rows for patterns
  let hasPercent = false;
  let hasDate = false;
  let rowCount = 0;

  let skipFirst = true;
  for (const child of tableNode.children) {
    if (child.type !== 'tableRow') continue;
    if (skipFirst) { skipFirst = false; continue; }

    const cells = child.children.filter(c => c.type === 'tableCell');
    const val = cells[colIndex] ? extractText(cells[colIndex]).trim() : '';
    if (!val) continue;
    rowCount++;

    if (/^\d+%$/.test(val) || /^\d+\.?\d*$/.test(val)) hasPercent = true;
    if (/^\d{4}[-/]\d{2}[-/]\d{2}/.test(val) || /^\d{2}[-/]\d{2}/.test(val)) hasDate = true;
  }

  if (STATUS_VALUES.has(colName.toLowerCase())) return 'badge';
  if (PRIORITY_VALUES.has(colName.toLowerCase())) return 'badge';
  if (hasPercent && rowCount > 0) return 'percent';
  if (hasDate && rowCount > 0) return 'date';
  return 'text';
}

/**
 * Generate a unique ID suffix for this directive instance.
 */
export function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Render a badge span for status/priority values.
 */
export function renderBadge(value, type) {
  const v = value.toLowerCase();
  const cls = `md-plan-badge md-plan-badge--${v}`;
  return `<span class="${cls}" data-type="${type}">${escapeHtml(value)}</span>`;
}

/**
 * Render a progress bar.
 */
export function renderProgress(value) {
  const num = parseInt(value, 10);
  const pct = isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
  return `<div class="md-plan-progress"><div class="md-plan-progress__bar" style="width:${pct}%"></div><span class="md-plan-progress__text">${pct}%</span></div>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
