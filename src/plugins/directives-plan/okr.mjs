/**
 * :::okr directive — Objectives and Key Results.
 *
 * Markdown structure:
 *   :::okr{title="..." period="..."}
 *   ## O1: Objective title
 *
 *   Optional description paragraph for the objective.
 *
 *   | Key Result | Target | Current | Description | Status |
 *   | ---------- | ------ | ------- | ----------- | ------ |
 *   | ...        | ...    | ...     | ...         | 正常   |
 *   :::
 */
export function processOkrDirective(node) {
    const attrs = node.attributes || {};
    const title = attrs.title || '';
    const period = attrs.period || '';
    const id = `okr-${Math.random().toString(36).slice(2, 7)}`;

    const objectives = parseObjectives(node);
    let totalProgress = 0;
    let totalKRs = 0;

    const objectivesHtml = objectives.map((obj, objIndex) => {
        const objNum = objIndex + 1;
        let objProgressSum = 0;

        const krItems = obj.krs.map((kr, krIndex) => {
            const target = parseFloat(kr.target) || 0;
            const current = parseFloat(kr.current) || 0;
            const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
            const desc = kr.description || '';
            const status = kr.status || '正常';
            const statusClass = getStatusClass(status);
            totalKRs++;
            totalProgress += pct;
            objProgressSum += pct;

            return `
                <div class="md-okr-kr">
                    <div class="md-okr-kr-main">
                        <span class="md-okr-badge md-okr-badge--kr">KR${krIndex + 1}</span>
                        <div class="md-okr-kr-content">
                            <div class="md-okr-kr-title">${escapeHtml(kr.name)}</div>
                            ${desc ? `<div class="md-okr-kr-desc">${escapeHtml(desc)}</div>` : ''}
                        </div>
                    </div>
                    <div class="md-okr-kr-meta">
                        <div class="md-okr-meta-row">
                            <span class="md-okr-status-tag ${statusClass}">${escapeHtml(status)}</span>
                            <span class="md-okr-pct">${Math.round(pct)}%</span>
                        </div>
                        <div class="md-okr-progress-track">
                            <div class="md-okr-progress-fill" style="width:${pct}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const objPct = obj.krs.length > 0 ? (objProgressSum / obj.krs.length) : 0;
        const objDesc = obj.desc || '';
        const objStatus = obj.status || '正常';
        const objStatusClass = getStatusClass(objStatus);

        return `
            <div class="md-okr-objective">
                <div class="md-okr-obj-header">
                    <div class="md-okr-obj-main">
                        <span class="md-okr-badge md-okr-badge--obj">O${objNum}</span>
                        <div class="md-okr-obj-content">
                            <div class="md-okr-obj-title">${escapeHtml(obj.title)}</div>
                            ${objDesc ? `<div class="md-okr-obj-desc">${escapeHtml(objDesc)}</div>` : ''}
                        </div>
                    </div>
                    <div class="md-okr-obj-meta">
                        <div class="md-okr-meta-row">
                            <span class="md-okr-status-tag ${objStatusClass}">${escapeHtml(objStatus)}</span>
                            <span class="md-okr-pct">${Math.round(objPct)}%</span>
                        </div>
                        <div class="md-okr-progress-track md-okr-progress-track--wide">
                            <div class="md-okr-progress-fill" style="width:${objPct}%"></div>
                        </div>
                    </div>
                </div>
                <div class="md-okr-krs">${krItems}</div>
            </div>
        `;
    }).join('');

    const overallPct = totalKRs > 0 ? (totalProgress / totalKRs) : 0;

    const html = `
        <div class="md-directive md-directive-okr" id="${id}">
            ${title || period ? `
                <div class="md-okr-header">
                    ${title ? `<h3 class="md-okr-header-title">${escapeHtml(title)}</h3>` : ''}
                    ${period ? `<span class="md-okr-header-period">${escapeHtml(period)}</span>` : ''}
                </div>
            ` : ''}
            ${totalKRs > 0 ? `
                <div class="md-okr-overall">
                    <span class="md-okr-overall-label">整体完成度</span>
                    <span class="md-okr-pct">${Math.round(overallPct)}%</span>
                    <div class="md-okr-progress-track md-okr-progress-track--overall">
                        <div class="md-okr-progress-fill" style="width:${overallPct}%"></div>
                    </div>
                </div>
            ` : ''}
            <div class="md-okr-body">${objectivesHtml}</div>
        </div>
    `;

    node.data = { hName: 'div', hProperties: {} };
    node.children = [{ type: 'html', value: html }];
}

function getStatusClass(status) {
    const s = (status || '').trim();
    if (s === '正常' || s === 'ontrack' || s === '正常進行') return 'md-okr-status--normal';
    if (s === '风险' || s === 'at-risk' || s === '有风险') return 'md-okr-status--risk';
    if (s === '滞后' || s === 'behind' || s === '延遲') return 'md-okr-status--behind';
    if (s === '完成' || s === 'completed' || s === '已完成') return 'md-okr-status--done';
    return 'md-okr-status--normal';
}

function parseObjectives(node) {
    const objectives = [];
    let currentObj = null;
    let pendingDesc = null;

    for (const child of node.children || []) {
        // Heading level 2 = Objective
        if (child.type === 'heading' && child.depth === 2) {
            if (currentObj) {
                if (pendingDesc) currentObj.desc = pendingDesc;
                objectives.push(currentObj);
            }
            const title = extractText(child);
            currentObj = { title, krs: [], desc: '' };
            pendingDesc = null;
            continue;
        }

        // Table (properly parsed by GFM)
        if (child.type === 'table' && currentObj) {
            const krs = parseKRTable(child);
            currentObj.krs.push(...krs);
            // Note: don't reset pendingDesc here — it's the obj description
            continue;
        }

        // Paragraph that looks like a table (when GFM doesn't run inside directive)
        if (currentObj && child.type === 'paragraph' && looksLikeTable(child)) {
            const krs = parseKRFromParagraph(child);
            currentObj.krs.push(...krs);
            continue;
        }

        // Description: any text node or paragraph between heading and table
        if (currentObj && currentObj.krs.length === 0) {
            const text = extractText(child).trim();
            if (text && !looksLikeTable(child)) {
                if (pendingDesc) {
                    pendingDesc += ' ' + text;
                } else {
                    pendingDesc = text;
                }
            }
            continue;
        }
    }

    if (currentObj) {
        if (pendingDesc) currentObj.desc = pendingDesc;
        objectives.push(currentObj);
    }
    return objectives;
}

function looksLikeTable(node) {
    const text = extractText(node).trim();
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    return lines.length >= 2 && lines.every(l => l.startsWith('|'));
}

function parseKRFromParagraph(node) {
    const text = extractText(node);
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return [];

    // Skip separator line (contains only dashes and pipes)
    const dataLines = lines.filter(l => !/^\|[\s\-:]+\|$/.test(l) && !/^\|[\s\-:|]+$/.test(l));
    if (dataLines.length < 1) return [];

    const headerLine = dataLines[0];
    const headers = headerLine.split('|').map(h => h.trim().toLowerCase()).filter(h => h);

    const nameIdx = headers.findIndex(h => ['key result', 'name', 'title', 'kr'].includes(h));
    const targetIdx = headers.findIndex(h => h === 'target');
    const currentIdx = headers.findIndex(h => h === 'current');
    const descIdx = headers.findIndex(h => ['description', 'desc', '说明', '描述', '備註'].includes(h));
    const statusIdx = headers.findIndex(h => ['status', 'state', '状态', '狀態'].includes(h));

    const krs = [];
    for (let i = 1; i < dataLines.length; i++) {
        const cells = dataLines[i].split('|').map(c => c.trim()).filter(c => c);
        const kr = {
            name: nameIdx >= 0 ? cells[nameIdx] || '' : '',
            target: targetIdx >= 0 ? cells[targetIdx] || '0' : '0',
            current: currentIdx >= 0 ? cells[currentIdx] || '0' : '0',
            description: descIdx >= 0 ? cells[descIdx] || '' : '',
            status: statusIdx >= 0 ? cells[statusIdx] || '正常' : '正常',
        };
        krs.push(kr);
    }

    return krs;
}

function parseKRTable(tableNode) {
    const krs = [];
    const rows = tableNode.children.filter(c => c.type === 'tableRow');
    if (rows.length < 2) return krs;

    const headers = rows[0].children
        .filter(c => c.type === 'tableCell')
        .map(c => extractText(c).trim().toLowerCase());

    const nameIdx = headers.findIndex(h => ['key result', 'name', 'title', 'kr'].includes(h));
    const targetIdx = headers.findIndex(h => h === 'target');
    const currentIdx = headers.findIndex(h => h === 'current');
    const descIdx = headers.findIndex(h => ['description', 'desc', '说明', '描述', '備註'].includes(h));
    const statusIdx = headers.findIndex(h => ['status', 'state', '状态', '狀態'].includes(h));

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].children.filter(c => c.type === 'tableCell');
        const kr = {
            name: nameIdx >= 0 ? extractText(cells[nameIdx]).trim() : '',
            target: targetIdx >= 0 ? extractText(cells[targetIdx]).trim() : '0',
            current: currentIdx >= 0 ? extractText(cells[currentIdx]).trim() : '0',
            description: descIdx >= 0 ? extractText(cells[descIdx]).trim() : '',
            status: statusIdx >= 0 ? extractText(cells[statusIdx]).trim() : '正常',
        };
        krs.push(kr);
    }

    return krs;
}

function extractText(node) {
    if (node.type === 'text') return node.value || '';
    if (node.children) return node.children.map(extractText).join('');
    return '';
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
