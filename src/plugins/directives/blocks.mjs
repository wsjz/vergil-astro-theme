import { visit } from 'unist-util-visit';
import { getIconSvg, resolveColor, escapeHtml, h, serializeToHtml } from './shared.mjs';

export function processBlockDirective(node, options = {}) {
    const { links, screenshotService } = options;
    const name = node.name;
    const attrs = node.attributes || {};

    switch (name) {
        case 'callout': {
            const type = attrs.type || 'info';
            const defaultTitles = { info: 'Info', tip: 'Tip', warn: 'Warning', danger: 'Danger' };
            const title = attrs.title || defaultTitles[type] || 'Info';
            const icons = {
                info: getIconSvg('lucide:info', 16),
                tip: getIconSvg('lucide:lightbulb', 16),
                warn: getIconSvg('lucide:triangle-alert', 16),
                danger: getIconSvg('lucide:circle-x', 16),
            };
            const colors = {
                info: { bar: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.22)' },
                tip: { bar: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.22)' },
                warn: { bar: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)' },
                danger: { bar: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.22)' },
            };
            const c = colors[type] || colors.info;
            const iconSvg = icons[type] || '';
            node.data = { hName: 'div', hProperties: { class: `md-directive md-directive-callout md-callout-${type}` } };
            node.children = [
                { type: 'html', value: `<div style="--callout-bar:${c.bar};--callout-bg:${c.bg};--callout-border:${c.border}"><div class="md-callout-inner"><div class="md-callout-title">${iconSvg}<span>${title}</span></div><div class="md-callout-body">` },
                ...node.children,
                { type: 'html', value: '</div></div></div>' }
            ];
            break;
        }

        case 'note': {
            const title = attrs.title || '';
            const color = resolveColor(attrs.color || 'accent');
            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-note' } };
            node.children = [
                { type: 'html', value: `<div style="--note-color:${color}">${title ? `<div class="md-note-title">${title}</div>` : ''}<div class="md-note-body">` },
                ...node.children,
                { type: 'html', value: '</div></div>' }
            ];
            break;
        }

        case 'folding': {
            const title = attrs.title || 'Details';
            const open = attrs.open === 'true' || attrs.open === '';
            const color = resolveColor(attrs.color || 'accent');
            node.data = {
                hName: 'details',
                hProperties: {
                    class: 'md-directive md-directive-folding',
                    style: `--folding-color:${color}`,
                    ...(open ? { open: true } : {})
                }
            };
            node.children = [
                { type: 'html', value: `<summary><span class="md-folding-title">${title}</span><span class="md-folding-arrow">${getIconSvg('lucide:chevron-down', 12)}</span></summary><div class="md-folding-body">` },
                ...node.children,
                { type: 'html', value: '</div>' }
            ];
            break;
        }

        case 'folders': {
            const folders = [];
            let currentFolder = null;
            let currentContent = [];
            for (const child of node.children) {
                if (child.type === 'paragraph') {
                    const text = child.children.map(c => c.value || '').join('').trim();
                    if (text.startsWith('folder:')) {
                        if (currentFolder !== null) folders.push({ title: currentFolder, children: currentContent });
                        currentFolder = text.slice(7).trim();
                        currentContent = [];
                        continue;
                    }
                }
                if (currentFolder !== null) currentContent.push(child);
            }
            if (currentFolder !== null) folders.push({ title: currentFolder, children: currentContent });

            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-folders' } };
            node.children = folders.map((f, i) => {
                const summaryHtml = `<summary><span class="md-folder-title">${f.title}</span><span class="md-folder-arrow">${getIconSvg('lucide:chevron-down', 12)}</span></summary>`;
                return h('details', { class: 'md-folder', ...(i === 0 ? { open: true } : {}) }, [
                    { type: 'html', value: summaryHtml },
                    h('div', { class: 'md-folder-body' }, f.children)
                ]);
            });
            break;
        }

        case 'timeline': {
            const items = [];
            visit({ type: 'root', children: node.children }, 'listItem', (listItem) => {
                let text = '';
                visit(listItem, 'text', (t) => { text += t.value; });
                const parts = text.split('|').map(s => s.trim());
                if (parts.length >= 2) items.push({ date: parts[0], title: parts[1], desc: parts[2] || '' });
            });
            const html = `<ol class="md-directive md-directive-timeline">${items.map((item, i) => `<li class="md-timeline-node"><div class="md-timeline-dot${i === 0 ? ' md-timeline-dot-first' : ''}"></div><div class="md-timeline-content"><time>${item.date}</time><h3>${item.title}</h3>${item.desc ? `<p>${item.desc}</p>` : ''}</div></li>`).join('')}</ol>`;
            node.data = { hName: 'div', hProperties: {} };
            node.children = [{ type: 'html', value: html }];
            break;
        }

        case 'tabs': {
            const align = attrs.align || '';
            const tabs = [];
            let currentTab = null;
            let currentTabColor = '';
            let currentContent = [];
            for (const child of node.children) {
                if (child.type === 'paragraph') {
                    const text = child.children.map(c => c.value || '').join('').trim();
                    if (text.startsWith('tab:')) {
                        if (currentTab !== null) tabs.push({ label: currentTab, color: currentTabColor, children: currentContent });
                        const raw = text.slice(4).trim();
                        const m = raw.match(/^(.+?)\{(color=[^}]+)\}$/);
                        currentTab = m ? m[1].trim() : raw;
                        currentTabColor = m ? resolveColor(m[2].slice(6).trim().replace(/^['"""]+|['"""]+$/g, '')) : '';
                        currentContent = [];
                        continue;
                    }
                }
                if (currentTab !== null) currentContent.push(child);
            }
            if (currentTab !== null) tabs.push({ label: currentTab, color: currentTabColor, children: currentContent });

            const uid = `tabs-${Math.random().toString(36).slice(2, 7)}`;
            const navHtml = tabs.map((t, i) => {
                const isActive = i === 0 ? 'md-tab-active' : '';
                const colorStyle = t.color ? ` style="--tab-active-color:${t.color}"` : '';
                const href = `${uid}-pane-${i}`;
                return `<a href="#${href}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" class="md-tab-btn ${isActive}"${colorStyle} data-tab-index="${i}" data-tabs-id="${uid}">${t.label}</a>`;
            }).join('');
            const paneEls = tabs.map((t, i) => {
                const isVisible = i === 0 ? 'md-tab-visible' : '';
                const href = `${uid}-pane-${i}`;
                return h('div', {
                    id: href,
                    class: `md-tab-pane ${isVisible}`,
                    role: 'tabpanel',
                    'aria-labelledby': `${uid}-tab-${i}`
                }, t.children);
            });

            node.data = { hName: 'div', hProperties: { id: uid, class: 'md-directive md-directive-tabs', ...(align ? { align } : {}) } };
            node.children = [
                { type: 'html', value: `<div class="md-tabs-nav" role="tablist">${navHtml}</div><div class="md-tabs-content">` },
                ...paneEls,
                { type: 'html', value: '</div>' }
            ];
            break;
        }

        case 'poetry': {
            const title = attrs.title || '';
            const author = attrs.author || '';
            const date = attrs.date || '';
            const footer = attrs.footer || '';
            node.data = { hName: 'div', hProperties: {} };
            node.children = [
                { type: 'html', value: `<div class="md-directive md-directive-poetry"><div class="md-poetry-content">${title ? `<div class="md-poetry-title">${title}</div>` : ''}${(author || date) ? `<div class="md-poetry-meta">${[author, date].filter(Boolean).join(' \u00b7 ')}</div>` : ''}<div class="md-poetry-body">` },
                ...node.children,
                { type: 'html', value: `</div>${footer ? `<div class="md-poetry-footer">${footer}</div>` : ''}</div></div>` }
            ];
            break;
        }

        case 'copy': {
            const label = attrs.label || '';
            let text = '';
            visit({ type: 'root', children: node.children }, 'text', (t) => { text += t.value; });
            text = text.trim();
            const uid = `copy-${Math.random().toString(36).slice(2, 7)}`;
            const safeText = text.replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>');
            const copyIcon = getIconSvg('lucide:copy', 14);
            const html = `<div class="md-directive md-directive-copy" data-md-copy="1">${label ? `<span class="md-copy-label">${label}</span>` : ''}<input id="${uid}" readonly value="${safeText}" class="md-copy-input" style="width:${Math.max(text.length * 8, 120)}px"><button class="md-copy-btn" data-copy-target="${uid}">${copyIcon}</button></div>`;
            node.data = { hName: 'div', hProperties: {} };
            node.children = [{ type: 'html', value: html }];
            break;
        }

        case 'grid': {
            const cols = attrs.cols || '';
            const gap = attrs.gap || '16';
            const minw = attrs.minw || '240px';
            const bg = attrs.bg || 'card';
            const cells = [];
            let currentCell = [];
            for (const child of node.children) {
                if (child.type === 'thematicBreak') {
                    cells.push(currentCell);
                    currentCell = [];
                } else {
                    currentCell.push(child);
                }
            }
            if (currentCell.length) cells.push(currentCell);

            const gridClasses = ['md-directive-grid', `md-grid-bg-${bg}`];
            const gridStyle = `--grid-gap:${gap}px`;
            if (cols) {
                gridClasses.push('md-grid-cols');
                node.data = { hName: 'div', hProperties: { class: `md-directive ${gridClasses.join(' ')}`, style: `${gridStyle};--grid-cols:${cols}` } };
            } else {
                gridClasses.push('md-grid-auto');
                node.data = { hName: 'div', hProperties: { class: `md-directive ${gridClasses.join(' ')}`, style: `${gridStyle};--grid-minw:${minw}` } };
            }
            node.children = cells.map(c => h('div', { class: 'md-grid-cell' }, c));
            break;
        }

        case 'blockquote': {
            const leftQuote = getIconSvg('bxs:quote-left', 28);
            const rightQuote = getIconSvg('bxs:quote-right', 28);
            node.data = { hName: 'blockquote', hProperties: { class: 'md-directive md-directive-blockquote' } };
            node.children = [
                { type: 'html', value: `<span class="md-blockquote-icon md-blockquote-icon-left">${leftQuote}</span>` },
                ...node.children,
                { type: 'html', value: `<span class="md-blockquote-icon md-blockquote-icon-right">${rightQuote}</span>` }
            ];
            break;
        }

        case 'quot': {
            const icon = attrs.icon || '';
            let text = '';
            visit({ type: 'root', children: node.children }, 'text', (t) => { text += t.value; });
            text = text.trim();
            const defaultIcon = getIconSvg('bxs:quote-left', 28);
            let iconHtml = '';
            if (icon) {
                if (/^https?:\/\//i.test(icon)) {
                    iconHtml = `<img class="md-quot-icon" src="${icon}" alt="" style="height:28px;width:auto;" />`;
                } else {
                    const iconifyMatch = icon.match(/^([a-z0-9-]+):([a-z0-9-]+)$/i);
                    if (iconifyMatch) {
                        iconHtml = `<span class="md-quot-icon">${getIconSvg(icon, '1.75rem')}</span>`;
                    } else {
                        const svg = getIconSvg(`lucide:${icon}`, '1.75rem');
                        iconHtml = svg
                            ? `<span class="md-quot-icon">${svg}</span>`
                            : `<span class="md-quot-icon">${icon}</span>`;
                    }
                }
            } else {
                iconHtml = `<span class="md-quot-icon-default">${defaultIcon}</span>`;
            }
            const html = `<div class="md-directive md-directive-quot">${iconHtml}<p class="md-quot-text">${text}</p></div>`;
            node.data = { hName: 'div', hProperties: {} };
            node.children = [{ type: 'html', value: html }];
            break;
        }

        case 'title': {
            const el = attrs.el || '';
            const level = Math.min(Math.max(parseInt(el.replace('h', ''), 10) || 2, 2), 6);
            const centered = attrs.centered === 'true' || attrs.centered === '' || attrs.centered === true;
            const icon = attrs.icon || '';
            const showPrefix = attrs.prefix !== 'false';
            const suffixAttr = attrs.suffix || '';
            const style = attrs.style || 'quote';
            const shadow = attrs.shadow === 'true' || attrs.shadow === '' || attrs.shadow === true;
            const color = resolveColor(attrs.color || 'rgb(255, 87, 36)');

            function extractText(children) {
                let result = '';
                for (const child of children || []) {
                    if (child.type === 'text') result += child.value || '';
                    else if (child.children) result += extractText(child.children);
                }
                return result;
            }
            function renderIcon(value) {
                if (!value) return '';
                if (/^https?:\/\//i.test(value)) {
                    return { type: 'html', value: `<img class="md-title-icon-img" src="${value}" alt="" />` };
                }
                const iconifyMatch = value.match(/^([a-z0-9-]+):([a-z0-9-]+)$/i);
                if (iconifyMatch) {
                    return { type: 'html', value: `<span class="md-title-icon-inline">${getIconSvg(value, '1em')}</span>` };
                }
                return { type: 'text', value };
            }
            const text = extractText(node.children).trim();
            const slug = text
                ? text.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '').toLowerCase()
                : '';
            const classes = ['md-title'];
            classes.push('md-directive');
            if (centered) classes.push('md-title-centered');
            if (style) classes.push(`md-title-style-${style}`);
            if (shadow) classes.push('md-title-shadow');
            const tag = `h${level}`;

            const hProps = { id: slug, class: classes.join(' ') };
            if (shadow) hProps.style = `--title-shadow-color:color-mix(in srgb, ${color} 50%, transparent)`;

            let children = [];
            if (style === 'quote') {
                const defaultPrefix = getIconSvg('bxs:quote-left', '1em');
                const defaultSuffix = getIconSvg('bxs:quote-right', '1em');
                const p = attrs.prefix !== undefined ? renderIcon(attrs.prefix) : { type: 'html', value: defaultPrefix };
                const s = suffixAttr ? renderIcon(suffixAttr) : { type: 'html', value: defaultSuffix };
                children = [
                    p ? h('span', { class: 'md-title-quote-icon', style: `--title-color:${color}` }, [p]) : undefined,
                    h('span', { class: 'md-title-text' }, [{ type: 'text', value: text }]),
                    s ? h('span', { class: 'md-title-quote-icon md-title-quote-icon-suffix', style: `--title-color:${color}` }, [s]) : undefined
                ].filter(Boolean);
            } else if (style === 'badge') {
                const defaultPrefix = getIconSvg('solar:hashtag-square-bold', '1em');
                const p = attrs.prefix !== undefined ? renderIcon(attrs.prefix) : { type: 'html', value: defaultPrefix };
                const badgeProps = { class: 'md-title-badge', style: `--title-color:${color}` };
                let badgeChildren = [];
                if (p) {
                    badgeChildren = [p];
                }
                children = [
                    h('span', badgeProps, badgeChildren),
                    h('span', { class: 'md-title-text' }, [{ type: 'text', value: text }])
                ];
            } else {
                const prefixHtml = centered && showPrefix
                    ? h('span', { class: 'md-title-prefix' }, [{ type: 'text', value: '#'.repeat(level) }])
                    : null;
                const iconHtml = icon ? h('span', { class: 'md-title-icon' }, [{ type: 'text', value: icon }]) : null;
                children = [
                    prefixHtml,
                    iconHtml,
                    h('span', { class: 'md-title-text' }, [{ type: 'text', value: text }])
                ].filter(Boolean);
            }

            node.data = { hName: tag, hProperties: hProps };
            node.children = children;
            break;
        }

        case 'reel': {
            const title = attrs.title || '';
            const author = attrs.author || '';
            const date = attrs.date || '';
            const footer = attrs.footer || '';
            const reelChildren = node.children;
            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-reel' } };
            node.children = [
                { type: 'html', value: '<div class="md-reel-content"><div class="md-reel-title">' + title + '</div>' },
                ...(author ? [{ type: 'html', value: '<div class="md-reel-meta"><span>' + author + '</span></div>' }] : []),
                { type: 'html', value: '<div class="md-reel-body"><div class="md-reel-main">' },
                ...reelChildren,
                { type: 'html', value: '</div></div>' },
                ...(date ? [{ type: 'html', value: '<div class="md-reel-date">' + date + '</div>' }] : []),
                { type: 'html', value: '<div class="md-reel-footer">' + footer + '</div></div>' }
            ];
            break;
        }

        case 'paper': {
            const style = attrs.style || '';
            const title = attrs.title || '';
            const author = attrs.author || '';
            const date = attrs.date || '';
            const footer = attrs.footer || '';
            const contentClasses = ['md-paper-content'];
            if (style) contentClasses.push(style);

            const originalChildren = node.children;
            const sectionNodes = [];
            let currentType = 'paragraph';
            let currentTitle = '';
            let currentContent = [];

            function flushSection() {
                if (currentContent.length === 0) return;
                if (currentType === 'paragraph') {
                    sectionNodes.push(h('div', { class: 'md-paper-paragraph' }, currentContent));
                } else if (currentType === 'section') {
                    sectionNodes.push(
                        h('div', { class: 'md-paper-section' }, [
                            { type: 'html', value: '<div class="md-paper-section-title">' + currentTitle + '</div>' },
                            h('div', { class: 'md-paper-section-content' }, currentContent)
                        ])
                    );
                } else if (currentType === 'line') {
                    const alignClass = currentTitle === 'right' ? ' md-paper-line-right' : '';
                    sectionNodes.push(h('div', { class: 'md-paper-line' + alignClass }, currentContent));
                }
                currentContent = [];
            }

            for (const child of originalChildren) {
                let match = null;
                if (child.type === 'html' && child.value) {
                    match = child.value.match(/<!--\s*(paragraph|section|line)(?:\s+(.*?))?\s*-->/);
                }
                if (!match && child.type === 'paragraph' && child.children && child.children.length > 0) {
                    const firstChild = child.children[0];
                    if (firstChild.type === 'html' && firstChild.value) {
                        match = firstChild.value.match(/<!--\s*(paragraph|section|line)(?:\s+(.*?))?\s*-->/);
                        if (match && child.children.length === 1) {
                            continue;
                        }
                    }
                }
                if (match) {
                    flushSection();
                    currentType = match[1];
                    currentTitle = (match[2] || '').trim();
                    continue;
                }
                currentContent.push(child);
            }
            flushSection();

            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-paper' } };
            node.children = [
                { type: 'html', value: '<div class="' + contentClasses.join(' ') + '"><div class="md-paper-title">' + title + '</div>' },
                h('div', { class: 'md-paper-body' }, sectionNodes),
                {
                    type: 'html', value: '<div class="md-paper-footer">' +
                        ((author || date) ? '<div class="md-paper-author-date">' +
                            (author ? '<span class="md-paper-author">' + author + '</span>' : '') +
                            (date ? '<span class="md-paper-date">' + date + '</span>' : '') +
                            '</div>' : '') +
                        footer + '</div></div>'
                }
            ];
            break;
        }

        case 'deadline': {
            const date = attrs.date || '';
            const title = attrs.title || '';
            const description = attrs.description || '';
            const showSeconds = attrs.showSeconds !== 'false';
            const expiredText = attrs.expiredText || '已截止';
            const units = showSeconds
                ? ['天', '时', '分', '秒']
                : ['天', '时', '分'];
            const uid = `dl-${Math.random().toString(36).slice(2, 7)}`;

            // Build flip-clock panels with colon separators
            const parts = [];
            units.forEach((u, i) => {
                parts.push(`<div class="md-deadline-unit-box"><div class="md-deadline-panel" data-unit="${i}"><div class="md-deadline-static-top"><span>00</span></div><div class="md-deadline-static-bottom"><span>00</span></div><div class="md-deadline-flip-top"><span>00</span></div><div class="md-deadline-flip-bottom"><span>00</span></div></div><span class="md-deadline-label">${u}</span></div>`);
                if (i < units.length - 1) {
                    parts.push('<span class="md-deadline-sep">:</span>');
                }
            });
            const unitHtml = parts.join('');

            const dateObj = new Date(date);
            const dateStr = dateObj.toLocaleDateString('zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });

            // Inline JS: flip-clock countdown
            const js = `<script>(function(el){var t=new Date(el.dataset.date),disp=el.querySelector('.md-deadline-display'),panels=disp.querySelectorAll('.md-deadline-panel');function tick(){var d=t-Date.now();if(d<=0){disp.innerHTML='<div class="md-deadline-expired">'+el.dataset.expired+'</div>';return;}var a=Math.floor(d/864e5),b=Math.floor(d%864e5/36e5),c=Math.floor(d%36e5/6e4),e=${showSeconds ? 'Math.floor(d%6e4/1e3)' : 'null'};var vals=[a,b,c,e];for(var i=0;i<panels.length;i++){if(vals[i]===null)continue;var p=panels[i];var nv=String(vals[i]).padStart(2,'0');var st=p.querySelector('.md-deadline-static-top span');var sb=p.querySelector('.md-deadline-static-bottom span');var ft=p.querySelector('.md-deadline-flip-top span');var fb=p.querySelector('.md-deadline-flip-bottom span');var ov=st.textContent;if(ov===nv)continue;p.classList.remove('flipping');void p.offsetHeight;ft.textContent=ov;fb.textContent=nv;st.textContent=nv;sb.textContent=nv;p.classList.add('flipping');}}tick();setInterval(tick,1e3);})(document.currentScript.previousElementSibling);</script>`;

            const html = `<div class="md-directive md-directive-deadline" id="${uid}" data-date="${date}" data-expired="${expiredText}">` +
                `${title ? `<div class="md-deadline-title"><span>${title}</span></div>` : ''}` +
                `<div class="md-deadline-display">${unitHtml}</div>` +
                `<div class="md-deadline-meta">目标日期 ${dateStr}</div>` +
                `${description ? `<div class="md-deadline-desc">${description}</div>` : ''}` +
                `</div>${js}`;

            node.data = { hName: 'div', hProperties: {} };
            node.children = [{ type: 'html', value: html }];
            break;
        }

        case 'okr': {
            processOkrBlock(node);
            break;
        }

        default:
            break;
    }
}

/* ===== OKR Helper Functions ===== */

function processOkrBlock(node) {
    const attrs = node.attributes || {};
    const title = attrs.title || '';
    const period = attrs.period || '';
    const id = `okr-${Math.random().toString(36).slice(2, 7)}`;

    const objectives = parseOkrObjectives(node);
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
            const statusClass = getOkrStatusClass(status);
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
        const objStatus = obj.status || '正常';
        const objStatusClass = getOkrStatusClass(objStatus);

        return `
            <div class="md-okr-objective">
                <div class="md-okr-obj-header">
                    <div class="md-okr-obj-main">
                        <span class="md-okr-badge md-okr-badge--obj">O${objNum}</span>
                        <div class="md-okr-obj-content">
                            <div class="md-okr-obj-title">${escapeHtml(obj.title)}</div>
                            ${obj.desc ? `<div class="md-okr-obj-desc">${escapeHtml(obj.desc)}</div>` : ''}
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

function getOkrStatusClass(status) {
    const s = (status || '').trim();
    if (s === '正常' || s === 'ontrack' || s === '正常進行') return 'md-okr-status--normal';
    if (s === '风险' || s === 'at-risk' || s === '有风险') return 'md-okr-status--risk';
    if (s === '滞后' || s === 'behind' || s === '延遲') return 'md-okr-status--behind';
    if (s === '完成' || s === 'completed' || s === '已完成') return 'md-okr-status--done';
    return 'md-okr-status--normal';
}

function parseOkrObjectives(node) {
    const objectives = [];
    let currentObj = null;
    let pendingDesc = null;

    for (const child of node.children || []) {
        if (child.type === 'heading' && child.depth === 2) {
            if (currentObj) {
                if (pendingDesc) currentObj.desc = pendingDesc;
                objectives.push(currentObj);
            }
            currentObj = { title: extractOkrText(child), krs: [], desc: '' };
            pendingDesc = null;
            continue;
        }
        if (child.type === 'table' && currentObj) {
            currentObj.krs.push(...parseOkrTable(child));
            continue;
        }
        if (currentObj && child.type === 'paragraph' && okrLooksLikeTable(child)) {
            currentObj.krs.push(...parseOkrFromParagraph(child));
            continue;
        }
        // Description: text between heading and table
        if (currentObj && currentObj.krs.length === 0) {
            const text = extractOkrText(child).trim();
            if (text && !okrLooksLikeTable(child)) {
                pendingDesc = pendingDesc ? pendingDesc + ' ' + text : text;
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

function okrLooksLikeTable(node) {
    const text = extractOkrText(node).trim();
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    return lines.length >= 2 && lines.every(l => l.startsWith('|'));
}

function parseOkrFromParagraph(node) {
    const text = extractOkrText(node);
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return [];
    const dataLines = lines.filter(l => !/^\|[\s\-:]+\|$/.test(l) && !/^\|[\s\-:|]+$/.test(l));
    if (dataLines.length < 1) return [];

    const headers = dataLines[0].split('|').map(h => h.trim().toLowerCase()).filter(h => h);
    const nameIdx = headers.findIndex(h => ['key result', 'name', 'title', 'kr'].includes(h));
    const targetIdx = headers.findIndex(h => h === 'target');
    const currentIdx = headers.findIndex(h => h === 'current');
    const descIdx = headers.findIndex(h => ['description', 'desc', '说明', '描述', '備註'].includes(h));
    const statusIdx = headers.findIndex(h => ['status', 'state', '状态', '狀態'].includes(h));

    const krs = [];
    for (let i = 1; i < dataLines.length; i++) {
        const cells = dataLines[i].split('|').map(c => c.trim()).filter(c => c);
        krs.push({
            name: nameIdx >= 0 ? cells[nameIdx] || '' : '',
            target: targetIdx >= 0 ? cells[targetIdx] || '0' : '0',
            current: currentIdx >= 0 ? cells[currentIdx] || '0' : '0',
            description: descIdx >= 0 ? cells[descIdx] || '' : '',
            status: statusIdx >= 0 ? cells[statusIdx] || '正常' : '正常',
        });
    }
    return krs;
}

function parseOkrTable(tableNode) {
    const krs = [];
    const rows = tableNode.children.filter(c => c.type === 'tableRow');
    if (rows.length < 2) return krs;

    const headers = rows[0].children
        .filter(c => c.type === 'tableCell')
        .map(c => extractOkrText(c).trim().toLowerCase());

    const nameIdx = headers.findIndex(h => ['key result', 'name', 'title', 'kr'].includes(h));
    const targetIdx = headers.findIndex(h => h === 'target');
    const currentIdx = headers.findIndex(h => h === 'current');
    const descIdx = headers.findIndex(h => ['description', 'desc', '说明', '描述', '備註'].includes(h));
    const statusIdx = headers.findIndex(h => ['status', 'state', '状态', '狀態'].includes(h));

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].children.filter(c => c.type === 'tableCell');
        krs.push({
            name: nameIdx >= 0 ? extractOkrText(cells[nameIdx]).trim() : '',
            target: targetIdx >= 0 ? extractOkrText(cells[targetIdx]).trim() : '0',
            current: currentIdx >= 0 ? extractOkrText(cells[currentIdx]).trim() : '0',
            description: descIdx >= 0 ? extractOkrText(cells[descIdx]).trim() : '',
            status: statusIdx >= 0 ? extractOkrText(cells[statusIdx]).trim() : '正常',
        });
    }
    return krs;
}

export { processOkrBlock };

function extractOkrText(node) {
    if (node.type === 'text') return node.value || '';
    if (node.children) return node.children.map(extractOkrText).join('');
    return '';
}
