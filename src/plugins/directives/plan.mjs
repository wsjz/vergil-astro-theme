/**
 * :::plan directive — 6 views (board, list, table, timeline, milestone, progress)
 *
 * Shared Markdown-table parser + view renderers.
 * All rendering is static at build time. View switching uses CSS :target.
 */

/* ============================================================
   Shared Table Parser
   ============================================================ */

function parsePlanTable(node) {
    const tableNode = node.children.find(c => c.type === 'table');
    if (!tableNode) return { columns: [], rows: [], colTypes: {} };

    const headerRow = tableNode.children.find(c => c.type === 'tableRow');
    if (!headerRow) return { columns: [], rows: [], colTypes: {} };

    const rawHeaders = headerRow.children
        .filter(c => c.type === 'tableCell')
        .map(cell => {
            let text = '';
            function extractText(children) {
                for (const child of children || []) {
                    if (child.type === 'text') text += child.value || '';
                    else if (child.type === 'inlineCode') text += child.value || '';
                    else if (child.type === 'textDirective') text += ':' + (child.name || '');
                    else if (child.children) extractText(child.children);
                }
            }
            extractText(cell.children);
            return text.trim();
        });

    // Parse `name:type` header format. No `:` means default to `text`.
    const columns = [];
    const colTypes = {};
    for (const header of rawHeaders) {
        if (header.includes(':')) {
            const [name, type] = header.split(':').map(s => s.trim());
            columns.push(name);
            colTypes[name] = type.toLowerCase();
        } else {
            columns.push(header);
            colTypes[header] = 'text';
        }
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
            let text = '';
            function extractText(children) {
                for (const child of children || []) {
                    if (child.type === 'text') text += child.value || '';
                    else if (child.type === 'inlineCode') text += child.value || '';
                    else if (child.type === 'textDirective') text += ':' + (child.name || '');
                    else if (child.children) extractText(child.children);
                }
            }
            extractText(cell.children);
            rowData[colName] = text.trim();
        });
        rows.push(rowData);
    }

    return { columns, rows, colTypes };
}

/* ============================================================
   Utilities
   ============================================================ */

function getStatusInfo(status) {
    const s = (status || '').toLowerCase().trim();
    if (s === 'done') return { dot: '&#9679;', label: '已完成', class: 'md-plan-status--done' };
    if (s === 'doing') return { dot: '&#9673;', label: '进行中', class: 'md-plan-status--doing' };
    if (s === 'todo') return { dot: '&#9675;', label: '待办', class: 'md-plan-status--todo' };
    return { dot: '&#9675;', label: s || '未知', class: 'md-plan-status--todo' };
}

function getPriorityInfo(priority) {
    const p = (priority || '').toUpperCase().trim();
    if (p === 'P0') return { dot: '&#9679;', label: p, class: 'md-plan-priority--high' };
    if (p === 'P1') return { dot: '&#9679;', label: p, class: 'md-plan-priority--medium' };
    if (p === 'P2' || p === 'P3') return { dot: '&#9675;', label: p, class: 'md-plan-priority--low' };
    return { dot: '&#9675;', label: p || '-', class: 'md-plan-priority--low' };
}

function parseProgress(val) {
    if (!val) return null;
    const match = String(val).match(/(\d+)/);
    return match ? Math.min(100, Math.max(0, parseInt(match[1], 10))) : null;
}

function renderProgressBar(percent, size = 'medium') {
    const p = parseProgress(percent);
    if (p === null) return `<span class="md-plan-progress-text">${escapeHtml(percent || '')}</span>`;
    return `<div class="md-plan-progress md-plan-progress--${size}"><div class="md-plan-progress__track"><div class="md-plan-progress__fill" style="width:${p}%"></div></div><span class="md-plan-progress__text">${p}%</span></div>`;
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function countByStatus(rows, statusCol = 'status') {
    const counts = { done: 0, doing: 0, todo: 0 };
    for (const row of rows) {
        const s = (row[statusCol] || '').toLowerCase().trim();
        if (counts.hasOwnProperty(s)) counts[s]++;
    }
    return counts;
}

function countByPriority(rows, priorityCol = 'priority') {
    const counts = { P0: 0, P1: 0, P2: 0 };
    for (const row of rows) {
        const p = (row[priorityCol] || '').toUpperCase().trim();
        if (counts.hasOwnProperty(p)) counts[p]++;
    }
    return counts;
}

function calcAverageProgress(rows, progressCol = 'progress') {
    let sum = 0, count = 0;
    for (const row of rows) {
        const p = parseProgress(row[progressCol]);
        if (p !== null) { sum += p; count++; }
    }
    return count > 0 ? Math.round(sum / count) : 0;
}

/* ============================================================
   View Renderers
   ============================================================ */

function renderPlanBoard(data, attrs, uid, mapping) {
    const { columns, rows, colTypes } = data;
    if (rows.length === 0) return `<p class="md-plan-empty">暂无数据</p>`;

    const groupBy = (attrs.groupBy || columns[0]).toLowerCase();
    const groupCol = columns.find(c => c.toLowerCase() === groupBy) || columns[0];

    const titleCol = mapping.title || columns[0];
    const dateCol = mapping.date || null;
    const priorityCol = mapping.priority || null;
    const ownerCol = mapping.owner || null;
    const progressCol = mapping.progress || null;

    // Group rows
    const groups = {};
    for (const row of rows) {
        const key = (row[groupCol] || '未分类').toString().trim();
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
    }

    // Group order: status uses fixed order, others alphabetical
    let groupKeys;
    const lowerGroup = groupCol.toLowerCase();
    if (lowerGroup === 'status' || lowerGroup === 'state') {
        const statusOrder = ['todo', 'doing', 'done'];
        const ordered = [];
        const others = [];
        for (const key of Object.keys(groups)) {
            const lower = key.toLowerCase();
            if (statusOrder.includes(lower)) ordered.push(key);
            else others.push(key);
        }
        ordered.sort((a, b) => statusOrder.indexOf(a.toLowerCase()) - statusOrder.indexOf(b.toLowerCase()));
        others.sort();
        groupKeys = [...ordered, ...others];
    } else {
        groupKeys = Object.keys(groups).sort();
    }

    let html = `<div class="md-plan-board">`;

    for (const key of groupKeys) {
        const groupRows = groups[key];
        const lowerKey = key.toLowerCase();
        let barClass = 'other';
        if (lowerKey === 'todo' || lowerKey === '待办') barClass = 'todo';
        else if (lowerKey === 'doing' || lowerKey === '进行中') barClass = 'doing';
        else if (lowerKey === 'done' || lowerKey === '已完成') barClass = 'done';

        html += `<div class="md-plan-board__column">`;
        html += `<div class="md-plan-board__header">`;
        html += `<span class="md-plan-board__header-bar md-plan-board__header-bar--${barClass}"></span>`;
        html += `<span class="md-plan-board__header-title">${escapeHtml(key)} (${groupRows.length})</span>`;
        html += `</div>`;
        html += `<div class="md-plan-board__cards">`;

        for (const row of groupRows) {
            html += `<div class="md-plan-board__card">`;
            if (row[titleCol]) html += `<div class="md-plan-board__card-title">${escapeHtml(row[titleCol])}</div>`;
            if (dateCol && row[dateCol]) html += `<div class="md-plan-board__card-date">${escapeHtml(row[dateCol])}</div>`;
            if (priorityCol && row[priorityCol]) {
                const pi = getPriorityInfo(row[priorityCol]);
                html += `<span class="md-plan-pill ${pi.class}">${pi.dot} ${pi.label}</span>`;
            }
            if (ownerCol && row[ownerCol]) html += `<div class="md-plan-board__card-owner">${escapeHtml(row[ownerCol])}</div>`;
            if (progressCol && row[progressCol]) html += renderProgressBar(row[progressCol]);
            html += `</div>`;
        }

        html += `</div></div>`;
    }

    html += `</div>`;
    return html;
}

function renderPlanList(data, attrs, uid, mapping) {
    const { columns, rows, colTypes } = data;
    if (rows.length === 0) return `<p class="md-plan-empty">暂无数据</p>`;

    const statusCol = mapping.status || null;
    const titleCol = mapping.title || columns[0];
    const dateCol = mapping.date || null;
    const priorityCol = mapping.priority || null;
    const ownerCol = mapping.owner || null;
    const progressCol = mapping.progress || null;

    let html = `<div class="md-plan-list">`;
    for (const row of rows) {
        const statusVal = statusCol ? (row[statusCol] || '').toLowerCase().trim() : 'todo';
        html += `<div class="md-plan-list__item">`;
        html += `<div class="md-plan-list__bar md-plan-list__bar--${statusVal || 'todo'}"></div>`;
        html += `<div class="md-plan-list__content">`;
        html += `<div class="md-plan-list__row">`;
        html += `<span class="md-plan-list__title">${escapeHtml(row[titleCol] || '')}</span>`;
        if (dateCol && row[dateCol]) html += `<span class="md-plan-list__date">${escapeHtml(row[dateCol])}</span>`;
        html += `</div>`;
        html += `<div class="md-plan-list__row md-plan-list__row--meta">`;
        html += `<span class="md-plan-list__meta">`;
        if (ownerCol && row[ownerCol]) html += `<span class="md-plan-list__owner">${escapeHtml(row[ownerCol])}</span>`;
        if (priorityCol && row[priorityCol]) {
            const pi = getPriorityInfo(row[priorityCol]);
            html += `<span class="md-plan-pill ${pi.class}">${pi.dot} ${pi.label}</span>`;
        }
        html += `</span>`;
        if (progressCol && row[progressCol]) html += renderProgressBar(row[progressCol], 'small');
        html += `</div>`;
        html += `</div></div>`;
    }
    html += `</div>`;
    return html;
}

function renderPlanTable(data, attrs, uid, mapping) {
    const { columns, rows, colTypes } = data;
    if (rows.length === 0) return `<p class="md-plan-empty">暂无数据</p>`;

    const statusCol = mapping.status || '';
    const priorityCol = mapping.priority || '';

    // Filters: explicit config only. No auto-inference.
    const filtersAttr = (attrs.filters || '').trim();
    const filterCols = [];
    if (filtersAttr && filtersAttr.toLowerCase() !== 'none') {
        const requested = filtersAttr.split(',').map(s => s.trim().toLowerCase());
        for (const req of requested) {
            const col = columns.find(c => c.toLowerCase() === req);
            if (col) filterCols.push(col);
        }
    }

    // Collect unique filter values
    const filterValues = {};
    for (const col of filterCols) {
        const vals = [...new Set(rows.map(r => r[col]).filter(Boolean))];
        if (vals.length > 1) filterValues[col] = vals;
    }

    // Build toolbar HTML with dropdown filters
    let toolbarHtml = '';
    if (Object.keys(filterValues).length > 0) {
        toolbarHtml += `<div class="md-plan-toolbar">`;
        toolbarHtml += `<div class="md-plan-search"><svg class="md-plan-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" class="md-plan-search__input" placeholder="搜索..." data-plan-search></div>`;

        for (const [col, values] of Object.entries(filterValues)) {
            const label = col;
            toolbarHtml += `<div class="md-plan-filter-dropdown" data-filter-col="${escapeHtml(col)}">`;
            toolbarHtml += `<button class="md-plan-filter-trigger" data-filter-val="">${escapeHtml(label)}: 全部 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>`;
            toolbarHtml += `<div class="md-plan-filter-menu">`;
            toolbarHtml += `<div class="md-plan-filter-item active" data-filter-val="">全部</div>`;
            for (const val of values) {
                toolbarHtml += `<div class="md-plan-filter-item" data-filter-val="${escapeHtml(val)}">${escapeHtml(val)}</div>`;
            }
            toolbarHtml += `</div></div>`;
        }
        toolbarHtml += `</div>`;
    } else {
        // No filters: just search box
        toolbarHtml += `<div class="md-plan-toolbar">`;
        toolbarHtml += `<div class="md-plan-search"><svg class="md-plan-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" class="md-plan-search__input" placeholder="搜索..." data-plan-search></div>`;
        toolbarHtml += `</div>`;
    }

    // Build table HTML
    let tableHtml = `<table class="md-plan-table">`;
    tableHtml += `<thead><tr>`;
    for (const col of columns) {
        const type = colTypes[col] || 'text';
        const sortable = ['text', 'date', 'status', 'priority', 'select', 'number'].includes(type);
        const sortAttr = sortable ? ` data-sort-col="${escapeHtml(col)}"` : '';
        tableHtml += `<th${sortAttr}>${escapeHtml(col)}${sortable ? '<span class="md-plan-sort-icon"></span>' : ''}</th>`;
    }
    tableHtml += `</tr></thead>`;

    tableHtml += `<tbody data-plan-tbody>`;
    for (const row of rows) {
        tableHtml += renderTableRow(row, columns, colTypes, statusCol, priorityCol);
    }
    tableHtml += `</tbody></table>`;

    // Inline JS for filter/sort/search
    const js = buildTableRuntime(uid, columns, rows, colTypes, statusCol, priorityCol);

    // Embed data as JSON for JS to read
    const dataJson = JSON.stringify(rows).replace(/'/g, "\\'").replace(/</g, '\\u003c');
    const colsJson = JSON.stringify(columns);
    const colTypesJson = JSON.stringify(colTypes);

    return `<div class="md-plan-table-wrap" data-plan-id="${uid}" data-plan-rows='${dataJson}' data-plan-cols='${colsJson}' data-plan-coltypes='${colTypesJson}' data-plan-status="${escapeHtml(statusCol)}" data-plan-priority="${escapeHtml(priorityCol)}">${toolbarHtml}${tableHtml}${js}</div>`;
}

function renderTableRow(row, columns, colTypes, statusCol, priorityCol) {
    let html = `<tr>`;
    for (const col of columns) {
        const val = row[col] || '';
        const type = colTypes[col] || 'text';
        html += `<td>`;
        if (type === 'status') {
            const si = getStatusInfo(val);
            html += `<span class="md-plan-status-dot ${si.class}">${si.dot}</span>`;
        } else if (type === 'priority') {
            const pi = getPriorityInfo(val);
            html += `<span class="md-plan-pill ${pi.class}">${pi.dot} ${pi.label}</span>`;
        } else if (type === 'checkbox') {
            const checked = val.toLowerCase() === 'true' || val === '1' || val === '✓';
            const dot = checked ? '&#9679;' : '&#9675;';
            const cls = checked ? 'md-plan-status--done' : 'md-plan-status--todo';
            html += `<span class="md-plan-status-dot ${cls}">${dot}</span>`;
        } else if (type === 'select') {
            html += `<span class="md-plan-pill">${escapeHtml(val)}</span>`;
        } else if (type === 'progress' || type === 'percent') {
            html += renderProgressBar(val, 'small');
        } else if (type === 'number') {
            const num = parseFloat(val);
            const display = !isNaN(num) ? num.toLocaleString('zh-CN') : escapeHtml(val);
            html += `<span class="md-plan-number">${display}</span>`;
        } else if (type === 'link') {
            const url = val.startsWith('http') ? val : `https://${val}`;
            html += `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-color);text-decoration:none;">${escapeHtml(val)}</a>`;
        } else {
            html += escapeHtml(val);
        }
        html += `</td>`;
    }
    html += `</tr>`;
    return html;
}

function buildTableRuntime(uid, columns, rows, colTypes, statusCol, priorityCol) {
    // Minified inline JS for table filter/sort/search
    return `<script>(function(d){if(!d)return;var r=JSON.parse(d.dataset.planRows||'[]'),c=JSON.parse(d.dataset.planCols||'[]'),t=JSON.parse(d.dataset.planColtypes||'{}');var tbody=d.querySelector('[data-plan-tbody]');var searchInp=d.querySelector('[data-plan-search]');var filterDDs=d.querySelectorAll('.md-plan-filter-dropdown');var sortHeaders=d.querySelectorAll('[data-sort-col]');var curSort={col:'',dir:0};var filters={};function esc(s){return(s+'').replace(/\u0026/g,'\u0026amp;').replace(/\u003c/g,'\u0026lt;').replace(/\u003e/g,'\u0026gt;').replace(/"/g,'\u0026quot;');}function renderRows(rows){if(rows.length===0){tbody.innerHTML='\u003ctr\u003e\u003ctd colspan="'+c.length+'" style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);font-size:0.85rem;"\u003e无匹配结果\u003c/td\u003e\u003c/tr\u003e';return;}tbody.innerHTML=rows.map(function(row){var h='\u003ctr\u003e';c.forEach(function(col){var v=row[col]||'',tp=t[col]||'text';h+='\u003ctd\u003e';if(tp==='status'){var s=v.toLowerCase().trim();var dot=s==='done'?'\u0026#9679;':s==='doing'?'\u0026#9673;':'\u0026#9675;';var cls=s==='done'?'md-plan-status--done':s==='doing'?'md-plan-status--doing':'md-plan-status--todo';h+='\u003cspan class="md-plan-status-dot '+cls+'"\u003e'+dot+'\u003c/span\u003e';}else if(tp==='priority'){var p=v.toUpperCase().trim();var pd=p==='P0'||p==='P1'?'\u0026#9679;':'\u0026#9675;';var pl=p||'-';var pcl=p==='P0'?'md-plan-priority--high':p==='P1'?'md-plan-priority--medium':'md-plan-priority--low';h+='\u003cspan class="md-plan-pill '+pcl+'"\u003e'+pd+' '+pl+'\u003c/span\u003e';}else if(tp==='checkbox'){var ch=v.toLowerCase()==='true'||v==='1'||v==='✓';var cd=ch?'\u0026#9679;':'\u0026#9675;';var ccl=ch?'md-plan-status--done':'md-plan-status--todo';h+='\u003cspan class="md-plan-status-dot '+ccl+'"\u003e'+cd+'\u003c/span\u003e';}else if(tp==='select'){h+='\u003cspan class="md-plan-pill"\u003e'+esc(v)+'\u003c/span\u003e';}else if(tp==='progress'||tp==='percent'){var m=(v+'').match(/(\\d+)/);var pct=m?Math.min(100,Math.max(0,parseInt(m[1]))):null;h+=pct!==null?'\u003cdiv class="md-plan-progress md-plan-progress--small"\u003e\u003cdiv class="md-plan-progress__track"\u003e\u003cdiv class="md-plan-progress__fill" style="width:'+pct+'%"\u003e\u003c/div\u003e\u003c/div\u003e\u003cspan class="md-plan-progress__text"\u003e'+pct+'%\u003c/span\u003e\u003c/div\u003e':esc(v);}else if(tp==='number'){var num=parseFloat(v);var dn=!isNaN(num)?num.toLocaleString('zh-CN'):esc(v);h+='\u003cspan class="md-plan-number"\u003e'+dn+'\u003c/span\u003e';}else if(tp==='link'){var u=v.startsWith('http')?v:'https://'+v;h+='\u003ca href="'+esc(u)+'" target="_blank" rel="noopener noreferrer" style="color:var(--accent-color);text-decoration:none;"\u003e'+esc(v)+'\u003c/a\u003e';}else{h+=esc(v);}h+='\u003c/td\u003e';});h+='\u003c/tr\u003e';return h;}).join('');}function applyFilters(){var result=r.slice();var q=searchInp?searchInp.value.toLowerCase().trim():'';if(q){result=result.filter(function(row){return c.some(function(col){return(row[col]||'').toLowerCase().includes(q);});});}Object.keys(filters).forEach(function(col){var val=filters[col];if(val){result=result.filter(function(row){return(row[col]||'')===val;});}});if(curSort.col\u0026\u0026curSort.dir){result.sort(function(a,b){var av=a[curSort.col]||'',bv=b[curSort.col]||'';var an=isNaN(+av)?av:+av;var bn=isNaN(+bv)?bv:+bv;if(an\u003c bn)return-1*curSort.dir;if(an\u003e bn)return curSort.dir;return 0;});}renderRows(result);}if(searchInp){searchInp.addEventListener('input',function(){applyFilters();});}filterDDs.forEach(function(dd){var col=dd.dataset.filterCol;var trigger=dd.querySelector('.md-plan-filter-trigger');var items=dd.querySelectorAll('.md-plan-filter-item');trigger.addEventListener('click',function(e){e.stopPropagation();document.querySelectorAll('.md-plan-filter-dropdown.open').forEach(function(o){if(o!==dd)o.classList.remove('open');});dd.classList.toggle('open');});items.forEach(function(item){item.addEventListener('click',function(){items.forEach(function(i){i.classList.remove('active');});item.classList.add('active');filters[col]=item.dataset.filterVal;var label=trigger.textContent.split(':')[0];trigger.innerHTML=esc(label)+': '+(item.dataset.filterVal?esc(item.dataset.filterVal):'全部')+' \u003csvg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"\u003e\u003cpolyline points="6 9 12 15 18 9"\/\u003e\u003c/svg\u003e';dd.classList.remove('open');applyFilters();});});});document.addEventListener('click',function(){document.querySelectorAll('.md-plan-filter-dropdown.open').forEach(function(dd){dd.classList.remove('open');});});sortHeaders.forEach(function(th){th.addEventListener('click',function(){var col=th.dataset.sortCol;var icon=th.querySelector('.md-plan-sort-icon');if(curSort.col===col){curSort.dir=curSort.dir===1?-1:curSort.dir===-1?0:1;}else{curSort.col=col;curSort.dir=1;}sortHeaders.forEach(function(h){var ic=h.querySelector('.md-plan-sort-icon');if(ic)ic.removeAttribute('data-sort-dir');});if(curSort.dir\u0026\u0026icon){icon.dataset.sortDir=curSort.dir===1?'asc':'desc';}applyFilters();});});})(document.currentScript.parentElement);\u003c/script\u003e`;
}

function renderPlanTimeline(data, attrs, uid, mapping) {
    const { columns, rows } = data;
    if (rows.length === 0) return `<p class="md-plan-empty">暂无数据</p>`;

    const titleCol = mapping.title || columns[0];
    const statusCol = mapping.status || null;

    const hasStart = !!mapping.startDate;
    const hasEnd = !!mapping.endDate;
    const dateCol = (hasStart || hasEnd) ? null : mapping.date;

    const entries = [];
    const dayMs = 86400000;

    if (hasStart || hasEnd) {
        for (const row of rows) {
            const s = hasStart ? row[mapping.startDate] : null;
            const e = hasEnd ? row[mapping.endDate] : null;
            if (s || e) {
                const start = s ? new Date(s) : null;
                const end = e ? new Date(e) : null;
                const validStart = start && !isNaN(start);
                const validEnd = end && !isNaN(end);
                if (validStart || validEnd) {
                    entries.push({ row, start: validStart ? start : null, end: validEnd ? end : null, isRange: true });
                }
            }
        }
    } else if (dateCol) {
        for (const row of rows) {
            const d = row[dateCol];
            if (d) {
                const parsed = new Date(d);
                if (!isNaN(parsed)) entries.push({ row, date: parsed, isRange: false });
            }
        }
    }

    if (entries.length === 0) {
        return `<p class="md-plan-empty">暂无日期数据</p>`;
    }

    let minDate, maxDate;
    if (hasStart || hasEnd) {
        const allDates = [];
        for (const e of entries) {
            if (e.start) allDates.push(e.start);
            if (e.end) allDates.push(e.end);
        }
        minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
        maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    } else {
        const dates = entries.map(e => e.date).sort((a, b) => a - b);
        minDate = dates[0];
        maxDate = dates[dates.length - 1];
    }
    const totalDays = Math.max(1, Math.ceil((maxDate - minDate) / dayMs));

    // Months header — flex equal distribution
    const months = new Map();
    const allDates = (hasStart || hasEnd)
        ? entries.flatMap(e => [e.start, e.end].filter(Boolean))
        : entries.map(e => e.date);
    for (const date of allDates) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!months.has(key)) months.set(key, { key, label: `${date.getMonth() + 1}月` });
    }

    // Key ticks: minDate, maxDate, all task point dates
    const tickDates = [];
    const seen = new Set();
    const addTickDate = (d) => {
        const t = d.getTime();
        if (!seen.has(t)) { seen.add(t); tickDates.push(d); }
    };
    addTickDate(minDate);
    addTickDate(maxDate);
    for (const entry of entries) {
        if (entry.isRange) {
            if (entry.start) addTickDate(entry.start);
            if (entry.end) addTickDate(entry.end);
        } else {
            addTickDate(entry.date);
        }
    }
    tickDates.sort((a, b) => a - b);

    // Deduplicate and filter overlapping ticks (estimated 45px min gap in a ~500px track)
    const EST_WIDTH = 500;
    const MIN_GAP_PX = 45;
    const minGapPct = (MIN_GAP_PX / EST_WIDTH) * 100;

    const finalTicks = [];
    for (const d of tickDates) {
        const pct = totalDays > 0 ? ((d - minDate) / dayMs / totalDays) * 100 : 0;
        const label = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        let tooClose = false;
        for (const kept of finalTicks) {
            if (Math.abs(pct - kept.pct) < minGapPct) {
                tooClose = true;
                break;
            }
        }
        if (!tooClose) finalTicks.push({ label, pct });
    }

    let html = `<div class="md-plan-timeline">`;

    // Months row — unified row structure
    html += `<div class="md-plan-timeline__row md-plan-timeline__row--months">`;
    html += `<div class="md-plan-timeline__row-label"></div>`;
    html += `<div class="md-plan-timeline__row-axis md-plan-timeline__row-axis--months">`;
    for (const [_, m] of months) {
        html += `<div class="md-plan-timeline__month">${escapeHtml(m.label)}</div>`;
    }
    html += `</div></div>`;

    // Ticks row — unified row structure, percentage positioned
    html += `<div class="md-plan-timeline__row md-plan-timeline__row--ticks">`;
    html += `<div class="md-plan-timeline__row-label"></div>`;
    html += `<div class="md-plan-timeline__row-axis">`;
    for (const t of finalTicks) {
        html += `<div class="md-plan-timeline__tick" style="left:${t.pct}%">${escapeHtml(t.label)}</div>`;
    }
    html += `</div></div>`;

    // Tracks
    html += `<div class="md-plan-timeline__tracks">`;
    for (const entry of entries) {
        const row = entry.row;
        const statusInfo = statusCol ? getStatusInfo(row[statusCol]) : { dot: '&#9679;', class: '' };

        html += `<div class="md-plan-timeline__track">`;
        html += `<div class="md-plan-timeline__track-label">${escapeHtml(row[titleCol] || '')}</div>`;
        html += `<div class="md-plan-timeline__track-line">`;

        if (entry.isRange) {
            const startOffset = entry.start ? Math.round((entry.start - minDate) / dayMs) : 0;
            const endOffset = entry.end ? Math.round((entry.end - minDate) / dayMs) : totalDays;
            const leftPercent = totalDays > 0 ? (startOffset / totalDays) * 100 : 0;
            const widthPercent = totalDays > 0 ? ((endOffset - startOffset) / totalDays) * 100 : 0;

            const barClass = (entry.start && entry.end) ? 'md-plan-timeline__track-bar' : 'md-plan-timeline__track-bar md-plan-timeline__track-bar--infinite';
            html += `<div class="${barClass}" style="left:${leftPercent}%;width:${widthPercent}%"></div>`;
            if (!entry.start || !entry.end) {
                const dotLeft = entry.start ? leftPercent : leftPercent + widthPercent;
                html += `<div class="md-plan-timeline__track-dot" style="left:${dotLeft}%" data-status="done">&#9679;</div>`;
            }
        } else {
            const dayOffset = Math.round((entry.date - minDate) / dayMs);
            const leftPercent = totalDays > 0 ? (dayOffset / totalDays) * 100 : 0;

            html += `<div class="md-plan-timeline__track-dot" style="left:${leftPercent}%" data-status="${statusCol ? (row[statusCol] || '').toLowerCase().trim() : 'done'}">${statusInfo.dot}</div>`;
        }

        html += `</div>`;
        html += `</div>`;
    }
    html += `</div>`;

    html += `</div>`;
    return html;
}

function renderPlanMilestone(data, attrs, uid, mapping) {
    const { columns, rows } = data;
    const dateCol = mapping.date;
    const titleCol = mapping.title || columns[0];
    const statusCol = mapping.status || null;
    const descCol = mapping.description || null;
    const priorityCol = mapping.priority || null;
    const ownerCol = mapping.owner || null;
    const progressCol = mapping.progress || null;

    if (!dateCol) {
        return `<p class="md-plan-empty">缺少 date 列</p>`;
    }

    const datedRows = [];
    for (const row of rows) {
        const d = row[dateCol];
        if (d) {
            const parsed = new Date(d);
            if (!isNaN(parsed)) datedRows.push({ row, date: parsed, dateStr: d });
        }
    }
    datedRows.sort((a, b) => a.date - b.date);

    let html = `<div class="md-plan-milestone">`;
    html += `<div class="md-plan-milestone__line"></div>`;

    for (const { row, dateStr } of datedRows) {
        const statusInfo = statusCol ? getStatusInfo(row[statusCol]) : { dot: '&#9679;', class: '' };
        const s = statusCol ? (row[statusCol] || '').toLowerCase().trim() : 'done';

        html += `<div class="md-plan-milestone__item">`;
        html += `<div class="md-plan-milestone__node">`;
        html += `<span class="md-plan-milestone__dot md-plan-milestone__dot--${s || 'todo'}">${statusInfo.dot}</span>`;
        html += `<div class="md-plan-milestone__date">${escapeHtml(dateStr)}</div>`;
        html += `</div>`;
        html += `<div class="md-plan-milestone__card">`;
        html += `<div class="md-plan-milestone__card-title">${escapeHtml(row[titleCol] || '')}</div>`;
        html += `<div class="md-plan-milestone__card-meta">`;
        if (ownerCol && row[ownerCol]) html += `<span>${escapeHtml(row[ownerCol])}</span>`;
        if (priorityCol && row[priorityCol]) {
            const pi = getPriorityInfo(row[priorityCol]);
            html += `<span class="md-plan-pill ${pi.class}">${pi.dot} ${pi.label}</span>`;
        }
        if (progressCol && row[progressCol]) html += renderProgressBar(row[progressCol], 'small');
        html += `</div>`;
        if (descCol && row[descCol]) {
            html += `<div class="md-plan-milestone__card-desc">${escapeHtml(row[descCol])}</div>`;
        }
        html += `</div>`;
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function renderPlanProgress(data, attrs, uid, mapping) {
    const { columns, rows } = data;
    if (rows.length === 0) return `<p class="md-plan-empty">暂无数据</p>`;

    const titleCol = mapping.title || columns[0];
    const progressCol = mapping.progress || null;
    const statusCol = mapping.status || null;
    const priorityCol = mapping.priority || null;

    const avgProgress = progressCol ? calcAverageProgress(rows, progressCol) : 0;
    const statusCounts = statusCol ? countByStatus(rows, statusCol) : { done: 0, doing: 0, todo: 0 };
    const priorityCounts = priorityCol ? countByPriority(rows, priorityCol) : { P0: 0, P1: 0, P2: 0 };
    const total = rows.length;

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - avgProgress / 100);

    let html = `<div class="md-plan-progress-view">`;

    html += `<div class="md-plan-progress-view__overall">`;
    html += `<div class="md-plan-progress-view__donut">`;
    html += `<svg viewBox="0 0 100 100" class="md-plan-donut">`;
    html += `<circle class="md-plan-donut__bg" cx="50" cy="50" r="${radius}"/>`;
    html += `<circle class="md-plan-donut__fg" cx="50" cy="50" r="${radius}" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"/>`;
    html += `<text x="50" y="48" text-anchor="middle" class="md-plan-donut__text">${avgProgress}%</text>`;
    html += `<text x="50" y="62" text-anchor="middle" class="md-plan-donut__label">整体完成度</text>`;
    html += `</svg>`;
    html += `</div>`;
    html += `<div class="md-plan-progress-view__summary">`;
    html += `<div class="md-plan-progress-view__summary-title">整体完成度</div>`;
    if (statusCol) {
        html += `<div class="md-plan-progress-view__summary-desc">${total} 个任务 · ${statusCounts.done} 已完成 · ${statusCounts.doing} 进行中 · ${statusCounts.todo} 待办</div>`;
    } else {
        html += `<div class="md-plan-progress-view__summary-desc">${total} 个条目</div>`;
    }
    html += `</div>`;
    html += `</div>`;

    if (progressCol) {
        html += `<div class="md-plan-progress-view__tasks">`;
        for (const row of rows) {
            const p = parseProgress(row[progressCol]);
            html += `<div class="md-plan-progress-view__task">`;
            html += `<span class="md-plan-progress-view__task-name">${escapeHtml(row[titleCol] || '')}</span>`;
            html += `<div class="md-plan-progress-view__task-bar-wrap">`;
            if (p !== null) {
                html += renderProgressBar(row[progressCol], 'medium');
            } else {
                html += `<span class="md-plan-progress-view__task-bar">${escapeHtml(row[progressCol] || '-')}</span>`;
            }
            html += `</div>`;
            html += `</div>`;
        }
        html += `</div>`;
    }

    if (statusCol || priorityCol) {
        html += `<div class="md-plan-progress-view__stats">`;

        if (statusCol) {
            html += `<div class="md-plan-progress-view__stat-group">`;
            html += `<div class="md-plan-progress-view__stat-title">状态分布</div>`;
            const statusOrder = ['done', 'doing', 'todo'];
            const statusNames = { done: '已完成', doing: '进行中', todo: '待办' };
            const statusDots = { done: '&#9679;', doing: '&#9673;', todo: '&#9675;' };
            for (const key of statusOrder) {
                const count = statusCounts[key];
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const barFilled = '█'.repeat(Math.round(pct / 10));
                const barEmpty = '░'.repeat(10 - Math.round(pct / 10));
                html += `<div class="md-plan-progress-view__stat-row">`;
                html += `<span class="md-plan-progress-view__stat-label">${statusDots[key]} ${statusNames[key]}</span>`;
                html += `<span class="md-plan-progress-view__stat-bar">${barFilled}${barEmpty}</span>`;
                html += `<span class="md-plan-progress-view__stat-count">${count}</span>`;
                html += `<span class="md-plan-progress-view__stat-pct">${pct}%</span>`;
                html += `</div>`;
            }
            html += `</div>`;
        }

        if (priorityCol) {
            html += `<div class="md-plan-progress-view__stat-group">`;
            html += `<div class="md-plan-progress-view__stat-title">优先级分布</div>`;
            const priorityOrder = ['P0', 'P1', 'P2'];
            const priorityDots = { P0: '&#9679;', P1: '&#9679;', P2: '&#9675;' };
            const priorityTotal = priorityCounts.P0 + priorityCounts.P1 + priorityCounts.P2;
            for (const key of priorityOrder) {
                const count = priorityCounts[key];
                const pct = priorityTotal > 0 ? Math.round((count / priorityTotal) * 100) : 0;
                const barFilled = '█'.repeat(Math.round(pct / 10));
                const barEmpty = '░'.repeat(10 - Math.round(pct / 10));
                html += `<div class="md-plan-progress-view__stat-row">`;
                html += `<span class="md-plan-progress-view__stat-label">${priorityDots[key]} ${key}</span>`;
                html += `<span class="md-plan-progress-view__stat-bar">${barFilled}${barEmpty}</span>`;
                html += `<span class="md-plan-progress-view__stat-count">${count}</span>`;
                html += `<span class="md-plan-progress-view__stat-pct">${pct}%</span>`;
                html += `</div>`;
            }
            html += `</div>`;
        }

        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function renderPlanEbbinghaus(data, attrs, uid, mapping) {
    const { columns, rows } = data;
    if (rows.length === 0) return `<p class="md-plan-empty">暂无数据</p>`;

    const titleCol = mapping.title || columns[0];
    const dateCol = mapping.date;

    if (!dateCol) {
        return `<p class="md-plan-empty">缺少 date 列</p>`;
    }

    // Parse custom steps from attrs, default to standard Ebbinghaus intervals
    let intervals = [1, 2, 4, 7, 15, 30];
    if (attrs.steps) {
        const parsed = String(attrs.steps)
            .split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(n => !isNaN(n) && n > 0);
        if (parsed.length > 0) intervals = parsed;
    }

    const dayMs = 86400000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entries = [];
    for (const row of rows) {
        const d = row[dateCol];
        if (!d) continue;
        const learnDate = new Date(d);
        if (isNaN(learnDate)) continue;
        learnDate.setHours(0, 0, 0, 0);

        const nodes = [];
        let completedCount = 0;
        for (const interval of intervals) {
            const reviewDate = new Date(learnDate.getTime() + interval * dayMs);
            reviewDate.setHours(0, 0, 0, 0);

            let status;
            if (reviewDate.getTime() === today.getTime()) {
                status = 'today';
            } else if (reviewDate.getTime() < today.getTime()) {
                status = 'completed';
                completedCount++;
            } else {
                status = 'pending';
            }

            nodes.push({
                nth: intervals.indexOf(interval) + 1,
                date: reviewDate,
                dateStr: `${String(reviewDate.getMonth() + 1).padStart(2, '0')}-${String(reviewDate.getDate()).padStart(2, '0')}`,
                status
            });
        }

        const pct = Math.round((completedCount / intervals.length) * 100);
        entries.push({ row, nodes, pct });
    }

    if (entries.length === 0) {
        return `<p class="md-plan-empty">暂无日期数据</p>`;
    }

    // Collect extra columns (excluding title and date) to show in hover cards
    const extraCols = columns.filter(c => c !== titleCol && c !== dateCol);

    let html = `<div class="md-plan-ebbinghaus">`;

    for (const entry of entries) {
        html += `<div class="md-plan-ebbinghaus__row">`;
        html += `<div class="md-plan-ebbinghaus__label">${escapeHtml(entry.row[titleCol] || '')}</div>`;
        html += `<div class="md-plan-ebbinghaus__track">`;

        for (let i = 0; i < entry.nodes.length; i++) {
            const node = entry.nodes[i];
            const statusClass = `md-plan-ebbinghaus__node--${node.status}`;

            const dotChar = node.status === 'completed' ? '&#9679;' : node.status === 'today' ? '&#9673;' : '&#9675;';
            const arrowHtml = node.status === 'today' ? '<span class="md-plan-ebbinghaus__arrow">&#9660;</span>' : '';

            html += `<div class="md-plan-ebbinghaus__node-wrap">`;
            html += `<div class="md-plan-ebbinghaus__node ${statusClass}">`;
            html += `${dotChar}${arrowHtml}`;
            html += `</div>`;

            // Hover card
            html += `<div class="md-plan-ebbinghaus__card">`;
            html += `<div class="md-plan-ebbinghaus__card-arrow"></div>`;
            html += `<div class="md-plan-ebbinghaus__card-body">`;
            html += `<div class="md-plan-ebbinghaus__card-title">第 ${node.nth} 次复习</div>`;
            html += `<div class="md-plan-ebbinghaus__card-date">${escapeHtml(node.dateStr)}</div>`;
            html += `<div class="md-plan-ebbinghaus__card-status">`;
            if (node.status === 'completed') {
                html += `<span class="md-plan-ebbinghaus__card-status--completed">已完成</span>`;
            } else if (node.status === 'today') {
                html += `<span class="md-plan-ebbinghaus__card-status--today">今天该复习</span>`;
            } else {
                html += `<span class="md-plan-ebbinghaus__card-status--pending">待复习</span>`;
            }
            html += `</div>`;

            // Extra plan details from other columns
            if (extraCols.length > 0) {
                html += `<div class="md-plan-ebbinghaus__card-details">`;
                for (const col of extraCols) {
                    const val = entry.row[col];
                    if (val) {
                        html += `<div class="md-plan-ebbinghaus__card-detail">`;
                        html += `<span class="md-plan-ebbinghaus__card-detail-label">${escapeHtml(col)}</span>`;
                        html += `<span class="md-plan-ebbinghaus__card-detail-value">${escapeHtml(val)}</span>`;
                        html += `</div>`;
                    }
                }
                html += `</div>`;
            }

            html += `</div>`;
            html += `</div>`;

            html += `</div>`;

            // Connector line between nodes (except after last)
            if (i < entry.nodes.length - 1) {
                html += `<div class="md-plan-ebbinghaus__line"></div>`;
            }
        }

        html += `</div>`;
        html += `<div class="md-plan-ebbinghaus__pct">${entry.pct}%</div>`;
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

/* ============================================================
   View Capability Model
   ============================================================ */

// Views that need specific column mappings to render
const VIEW_NEEDS = {
    timeline:   ['date'],     // dateCol OR (startDate OR endDate)
    milestone:  ['date'],     // dateCol only
    progress:   ['progress'], // progressCol required
    ebbinghaus: ['date'],     // dateCol only
};

function resolveColumnMapping(columns, attrs) {
    const mapping = {};

    if (attrs.dateCol) mapping.date = attrs.dateCol;
    if (attrs.startDate) mapping.startDate = attrs.startDate;
    if (attrs.endDate) mapping.endDate = attrs.endDate;
    if (attrs.progressCol) mapping.progress = attrs.progressCol;
    if (attrs.statusCol) mapping.status = attrs.statusCol;
    if (attrs.titleCol) mapping.title = attrs.titleCol;
    if (attrs.ownerCol) mapping.owner = attrs.ownerCol;
    if (attrs.priorityCol) mapping.priority = attrs.priorityCol;
    if (attrs.descCol) mapping.description = attrs.descCol;

    return mapping;
}

function filterViews(views, mapping) {
    return views.filter(view => {
        const needs = VIEW_NEEDS[view];
        if (!needs) return true; // General views always render
        for (const need of needs) {
            // For date, check single dateCol OR startDate OR endDate
            if (need === 'date') {
                if (mapping.date || mapping.startDate || mapping.endDate) continue;
                return false;
            }
            // For progress, check progressCol
            if (need === 'progress') {
                if (mapping.progress) continue;
                return false;
            }
            if (!mapping[need]) return false;
        }
        return true;
    });
}

/* ============================================================
   Main Entry Point
   ============================================================ */

export function processPlanDirective(node, options = {}) {
    try {
        const attrs = node.attributes || {};
        const title = attrs.title || '';
        const viewsAttr = attrs.views || 'board,list,table,timeline,milestone,progress';
        const rawViews = viewsAttr.split(',').map(v => v.trim()).filter(Boolean);

        const data = parsePlanTable(node);
        const mapping = resolveColumnMapping(data.columns, attrs);
        const views = filterViews(rawViews, mapping);
        const defaultView = attrs.default || views[0] || 'board';

        const uid = `plan-${Math.random().toString(36).slice(2, 9)}`;

        const viewLabels = {
            board: '\u770b\u677f',
            list: '\u5217\u8868',
            table: '\u8868\u683c',
            timeline: '\u65f6\u95f4\u8f74',
            milestone: '\u91cc\u7a0b\u7891',
            progress: '\u8fdb\u5ea6',
            ebbinghaus: '\u590d\u4e60'
        };

        const viewIcons = {
            board: '<svg class="md-plan-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
            list: '<svg class="md-plan-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
            table: '<svg class="md-plan-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
            timeline: '<svg class="md-plan-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
            milestone: '<svg class="md-plan-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
            progress: '<svg class="md-plan-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
            ebbinghaus: '<svg class="md-plan-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>'
        };

        const totalRows = data.rows.length;

        let inputsHtml = '';
        views.forEach((view, i) => {
            const isChecked = view === defaultView ? ' checked' : '';
            inputsHtml += `<input type="radio" name="${uid}" id="${uid}-${view}" class="md-plan-state md-plan-state--${i}"${isChecked}>`;
        });

        let navHtml = '<nav class="md-plan-tabs">';
        views.forEach((view, i) => {
            const label = viewLabels[view] || view;
            const icon = viewIcons[view] || '';
            const badge = totalRows > 0 ? `<span class="md-plan-tab__badge">${totalRows}</span>` : '';
            navHtml += `<label for="${uid}-${view}" class="md-plan-tab md-plan-tab--${i}" data-view="${view}">${icon}<span class="md-plan-tab__label">${label}</span>${badge}</label>`;
        });
        navHtml += '</nav>';

        const viewSections = [];
        views.forEach((view, i) => {
            let viewHtml = '';
            switch (view) {
                case 'board': viewHtml = renderPlanBoard(data, attrs, uid, mapping); break;
                case 'list': viewHtml = renderPlanList(data, attrs, uid, mapping); break;
                case 'table': viewHtml = renderPlanTable(data, attrs, uid, mapping); break;
                case 'timeline': viewHtml = renderPlanTimeline(data, attrs, uid, mapping); break;
                case 'milestone': viewHtml = renderPlanMilestone(data, attrs, uid, mapping); break;
                case 'progress': viewHtml = renderPlanProgress(data, attrs, uid, mapping); break;
                case 'ebbinghaus': viewHtml = renderPlanEbbinghaus(data, attrs, uid, mapping); break;
                default: viewHtml = `<p>Unknown view: ${escapeHtml(view)}</p>`;
            }
            viewSections.push(`<section class="md-plan-view md-plan-view--${view} md-plan-view--idx-${i}">${viewHtml}</section>`);
        });

        const headerHtml = title ? `<div class="md-plan-header"><h3 class="md-plan-header__title">${escapeHtml(title)}</h3></div>` : '';
        const html = `<div class="md-directive md-directive-plan" data-plan-id="${uid}">${headerHtml}${inputsHtml}${navHtml}${viewSections.join('')}</div>`;

        node.data = { hName: 'div', hProperties: {} };
        node.children = [{ type: 'html', value: html }];
    } catch (e) {
        node.data = { hName: 'div', hProperties: {} };
        node.children = [{ type: 'html', value: `<pre style="color:red;background:#fee;padding:1rem;border-radius:8px">${escapeHtml(String(e.stack || e))}</pre>` }];
    }
}
