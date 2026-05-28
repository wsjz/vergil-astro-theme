/**
 * :::calendar directive — pixel-perfect macOS Calendar recreation.
 *
 * Features:
 *   • Fixed 6-row grid (42 cells) with equal row heights
 *   • Title always shows YYYY年M月
 *   • Lunar dates + Gregorian dates in each cell
 *   • Solar terms (节气) as auto-detected events
 *   • Legal holidays with cross-day bars for consecutive rest days
 *   • Holiday name shown separately on the target date
 *   • Work-day makeup (调休) shown in orange-red
 *   • Traditional / solar festivals (e.g. 儿童节, 建党节)
 *   • User-defined events from markdown table with auto color assignment
 *   • Supports user-specified color via table column
 */
import { Solar, HolidayUtil } from 'lunar-javascript';
import { getIconSvg } from './shared.mjs';

/* Color palette — auto-assigned to unknown tag types */
const TAG_PALETTE = [
    { cls: 'md-event-blue',   bg: '#e8f0fe', text: '#1967d2' },
    { cls: 'md-event-green',  bg: '#e6f4ea', text: '#137333' },
    { cls: 'md-event-red',    bg: '#fce8e6', text: '#c5221f' },
    { cls: 'md-event-purple', bg: '#f3e8fd', text: '#9334e6' },
    { cls: 'md-event-yellow', bg: '#fef7e0', text: '#b06000' },
    { cls: 'md-event-cyan',   bg: '#e0f7fa', text: '#00796b' },
    { cls: 'md-event-orange', bg: '#fff3e0', text: '#e65100' },
    { cls: 'md-event-pink',   bg: '#fce4ec', text: '#c2185b' },
];

const BAR_STYLE  = { cls: 'md-event-purple', bg: '#f3e8fd', text: '#9334e6' };
const WORK_STYLE = { cls: 'md-event-red',    bg: '#fce8e6', text: '#c5221f' };
const WEEKDAYS   = ['日', '一', '二', '三', '四', '五', '六'];
const NAV_RANGE  = 12;
const GRID_CELLS = 42;

/* runtime cache: tag type → palette index */
const tagColorMap = new Map();
let tagColorIndex = 0;

function getTagStyle(type, userColor) {
    /* user-specified color takes highest priority */
    if (userColor) {
        const normalized = userColor.toLowerCase().trim();
        const found = TAG_PALETTE.find(p => p.cls === `md-event-${normalized}`);
        if (found) return found;
    }

    /* auto-assign from palette for unknown types */
    if (type && !tagColorMap.has(type)) {
        tagColorMap.set(type, tagColorIndex % TAG_PALETTE.length);
        tagColorIndex++;
    }
    const idx = type ? tagColorMap.get(type) : TAG_PALETTE.length - 1;
    return TAG_PALETTE[idx] || TAG_PALETTE[TAG_PALETTE.length - 1];
}

/* ─── Client-side navigation script ─── */
const NAV_SCRIPT = `<script>
(function(){
  if(window.__calNav)return;window.__calNav=true;
  function initCal(cal){
    var months=cal.querySelectorAll('.md-calendar-month');
    var idx=-1;
    for(var i=0;i<months.length;i++){if(months[i].style.display!=='none'){idx=i;break;}}
    if(idx<0)return;
    var prev=cal.querySelector('.md-calendar-btn--prev');
    var next=cal.querySelector('.md-calendar-btn--next');
    if(prev){prev.style.opacity=idx>0?'1':'0.3';prev.style.pointerEvents=idx>0?'auto':'none';}
    if(next){next.style.opacity=idx<months.length-1?'1':'0.3';next.style.pointerEvents=idx<months.length-1?'auto':'none';}
  }
  document.querySelectorAll('.md-directive-calendar').forEach(initCal);
  document.addEventListener('click',function(e){
    var btn=e.target.closest('.md-calendar-btn');
    if(!btn)return;
    e.preventDefault();
    var cal=btn.closest('.md-directive-calendar');
    if(!cal)return;
    var months=cal.querySelectorAll('.md-calendar-month');
    var cur=-1;
    for(var i=0;i<months.length;i++){if(months[i].style.display!=='none'){cur=i;break;}}
    if(cur<0)return;
    var action=btn.dataset.action;
    var nxt=cur;
    if(action==='prev'&&cur>0)nxt--;
    else if(action==='next'&&cur<months.length-1)nxt++;
    else if(action==='today'){
      var t=new Date();
      var tm=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0');
      for(var i=0;i<months.length;i++){if(months[i].id.indexOf('-'+tm)>0){nxt=i;break;}}
    }
    if(nxt!==cur){
      months[cur].style.display='none';
      months[nxt].style.display='block';
      var parts=months[nxt].id.split('-');
      var yy=parts[parts.length-2];
      var mm=parseInt(parts[parts.length-1]);
      var title=cal.querySelector('.md-calendar-title');
      if(title)title.textContent=yy+'年'+mm+'月';
      var prev=cal.querySelector('.md-calendar-btn--prev');
      var next=cal.querySelector('.md-calendar-btn--next');
      if(prev){prev.style.opacity=nxt>0?'1':'0.3';prev.style.pointerEvents=nxt>0?'auto':'none';}
      if(next){next.style.opacity=nxt<months.length-1?'1':'0.3';next.style.pointerEvents=nxt<months.length-1?'auto':'none';}
    }
  });
})();
</script>`;

function uid(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
}

export function processCalendarDirective(node) {
    const attrs       = node.attributes || {};
    const rawMonth    = attrs.month;
    const targetMonth = typeof rawMonth === 'string' && /^\d{4}-\d{2}$/.test(rawMonth)
        ? rawMonth
        : formatMonth(new Date());
    const calId = uid('cal');

    /* reset color allocation per calendar instance */
    tagColorMap.clear();
    tagColorIndex = 0;

    const userEvents = parseEvents(node);
    const allEvents  = collectAllEvents(userEvents, targetMonth);

    const months   = generateMonthRange(targetMonth, NAV_RANGE);
    const targetIdx = months.indexOf(targetMonth);
    const views    = months.map((m, i) => renderMonth(m, allEvents, calId, i === targetIdx));

    const prevDisabled = targetIdx === 0 ? ' style="opacity:0.3;pointer-events:none"' : '';
    const nextDisabled = targetIdx === months.length - 1 ? ' style="opacity:0.3;pointer-events:none"' : '';

    const html = `<div class="md-directive md-directive-calendar" id="${calId}">
  <div class="md-calendar-header">
    <div class="md-calendar-title">${formatMonthLabel(targetMonth)}</div>
    <div class="md-calendar-controls">
      <button type="button" class="md-calendar-btn md-calendar-btn--prev" data-action="prev" aria-label="上月"${prevDisabled}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 2 4 7 9 12"/></svg>
      </button>
      <button type="button" class="md-calendar-btn md-calendar-btn--today" data-action="today">今天</button>
      <button type="button" class="md-calendar-btn md-calendar-btn--next" data-action="next" aria-label="下月"${nextDisabled}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 2 10 7 5 12"/></svg>
      </button>
    </div>
  </div>
  <div class="md-calendar-weekdays">
    ${WEEKDAYS.map(d => `<div class="md-calendar-weekday">${d}</div>`).join('')}
  </div>
  ${views.join('')}
</div>${NAV_SCRIPT}`;

    node.data = { hName: 'div', hProperties: {} };
    node.children = [{ type: 'html', value: html }];
}

function collectAllEvents(userEvents, targetMonth) {
    const map = {};

    for (const e of userEvents) {
        const d = normalizeDate(e.date);
        if (d) {
            if (!map[d]) map[d] = [];
            map[d].push({ ...e, auto: false, priority: 10 });
        }
    }

    const months = generateMonthRange(targetMonth, NAV_RANGE);
    for (const monthStr of months) {
        const [year, month] = monthStr.split('-').map(Number);
        const dim = new Date(year, month, 0).getDate();
        for (let day = 1; day <= dim; day++) {
            const dk = `${monthStr}-${String(day).padStart(2, '0')}`;
            const solar = Solar.fromYmd(year, month, day);
            const lunar = solar.getLunar();

            const jieQi = lunar.getJieQi();
            if (jieQi) {
                if (!map[dk]) map[dk] = [];
                map[dk].push({ content: jieQi, auto: true, priority: 3, kind: 'term' });
            }

            const holiday = HolidayUtil.getHoliday(year, month, day);
            let holidayName = null;
            if (holiday) {
                holidayName = holiday.getName();
                const isWork = holiday.isWork();
                const target = holiday.getTarget();

                if (!map[dk]) map[dk] = [];

                if (isWork) {
                    map[dk].push({
                        content: holidayName + '（班）',
                        auto: true, priority: 2, kind: 'work'
                    });
                } else {
                    map[dk].push({
                        content: holidayName + '（休）',
                        auto: true, priority: 0, kind: 'bar', barName: holidayName,
                        isHoliday: true, isWorkDay: false
                    });
                    if (target === dk) {
                        map[dk].push({
                            content: holidayName,
                            auto: true, priority: 1, kind: 'holiday'
                        });
                    }
                }
            }

            const festivals = lunar.getFestivals();
            for (const f of festivals) {
                if (f === holidayName) continue;
                if (!map[dk]) map[dk] = [];
                map[dk].push({ content: f, auto: true, priority: 2, kind: 'festival' });
            }
        }
    }

    for (const k of Object.keys(map)) {
        map[k].sort((a, b) => a.priority - b.priority);
    }
    return map;
}

function renderMonth(monthStr, allEvents, parentId, isDefault) {
    const [year, month] = monthStr.split('-').map(Number);
    const firstDoM  = new Date(year, month - 1, 1);
    const startWD   = firstDoM.getDay();
    const dim       = new Date(year, month, 0).getDate();
    const today     = new Date();
    const isCurM    = today.getFullYear() === year && today.getMonth() + 1 === month;

    const cells = [];

    const prevM = month === 1 ? 12 : month - 1;
    const prevY = month === 1 ? year - 1 : year;
    const prevDim = new Date(prevY, prevM, 0).getDate();
    for (let i = startWD - 1; i >= 0; i--) {
        const d = prevDim - i;
        const dk = `${prevY}-${String(prevM).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        cells.push(makeCell(prevY, prevM, d, true, false, allEvents[dk]));
    }

    for (let d = 1; d <= dim; d++) {
        const dk = `${monthStr}-${String(d).padStart(2,'0')}`;
        const isToday = isCurM && isSameDay(today, new Date(year, month - 1, d));
        cells.push(makeCell(year, month, d, false, isToday, allEvents[dk]));
    }

    const nextM = month === 12 ? 1 : month + 1;
    const nextY = month === 12 ? year + 1 : year;
    const need = GRID_CELLS - cells.length;
    for (let d = 1; d <= need; d++) {
        const dk = `${nextY}-${String(nextM).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        cells.push(makeCell(nextY, nextM, d, true, false, allEvents[dk]));
    }

    const barNames = cells.map(c => {
        const bar = c.events.find(e => e.kind === 'bar');
        return bar ? bar.barName : null;
    });

    const positions = cells.map((c, i) => {
        const name = barNames[i];
        if (!name) return null;
        const hasPrev = i > 0 && barNames[i - 1] === name;
        const hasNext = i < cells.length - 1 && barNames[i + 1] === name;
        if (!hasPrev && !hasNext) return 'single';
        if (!hasPrev && hasNext)  return 'start';
        if (hasPrev && hasNext)   return 'middle';
        return 'end';
    });

    const html = cells.map((c, i) => renderCell(c, positions[i])).join('');

    return `<div id="${parentId}-${monthStr}" class="md-calendar-month" style="display:${isDefault ? 'block' : 'none'}">
  <div class="md-calendar-grid">${html}</div>
</div>`;
}

function makeCell(year, month, day, isOther, isToday, events = []) {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    const lunarDay   = lunar.getDayInChinese();
    const lunarMonth = lunar.getMonthInChinese();
    const isFirst    = lunarDay === '初一';
    return {
        year, month, day, isOther, isToday,
        events: events || [],
        lunarLabel: isFirst ? `${lunarMonth}月初一` : lunarDay,
        isFirstDay: isFirst,
    };
}

function renderCell(c, barPos) {
    const { year, month, day, isOther, isToday, events, lunarLabel, isFirstDay } = c;

    const otherClass = isOther ? ' md-calendar-cell--other' : '';
    const todayClass = isToday ? ' md-calendar-cell--today' : '';
    const gregorian  = day === 1 ? `${month}月${day}日` : `${day}日`;

    const barEvent = events.find(e => e.kind === 'bar');
    const regular  = events.filter(e => e.kind !== 'bar');

    const barHtml = (barEvent && barPos)
        ? renderBar(barEvent, barPos)
        : '';

    const maxEvt = barEvent ? 2 : 3;
    const blocks = regular.slice(0, maxEvt).map(e => {
        let cfg;
        if (e.kind === 'work') cfg = WORK_STYLE;
        else if (e.auto)        cfg = BAR_STYLE;
        else                    cfg = getTagStyle(e.type, e.color);
        const hasLink = !!e.link;
        const tag = hasLink ? 'a' : 'div';
        const linkAttr = hasLink ? ` href="${escapeHtml(e.link)}" target="_blank" rel="noopener noreferrer"` : '';
        const linkCls = hasLink ? ' md-calendar-event--link' : '';
        const arrowSvg = hasLink ? getIconSvg('lucide:external-link', 10).replace(/<svg/, '<svg class="md-calendar-event-arrow"') : '';
        return `<${tag} class="md-calendar-event ${cfg.cls}${linkCls}" style="--evt-bg:${cfg.bg};--evt-text:${cfg.text}"${linkAttr}>${escapeHtml(e.content)}${arrowSvg}</${tag}>`;
    }).join('');

    const more = regular.length > maxEvt ? regular.length - maxEvt : 0;
    const moreHtml = more > 0
        ? `<div class="md-calendar-event md-calendar-event--more">+${more} 更多</div>`
        : '';

    const tipHtml = events.length
        ? `<div class="md-calendar-tooltip">${events.map(e => {
            let cfg;
            if (e.kind === 'work') cfg = WORK_STYLE;
            else if (e.auto)        cfg = BAR_STYLE;
            else                    cfg = getTagStyle(e.type, e.color);
            return `<div class="md-calendar-tooltip-item"><span class="md-calendar-tooltip-dot" style="background:${cfg.text}"></span>${escapeHtml(e.content)}</div>`;
        }).join('')}</div>`
        : '';

    const lunarClass = isFirstDay ? ' md-calendar-lunar--first' : '';

    return `<div class="md-calendar-cell${otherClass}${todayClass}">
  <div class="md-calendar-cell-top">
    <span class="md-calendar-lunar${lunarClass}">${lunarLabel}</span>
    <span class="md-calendar-day-num">${gregorian}</span>
  </div>
  ${barHtml}
  <div class="md-calendar-cell-events">${blocks}${moreHtml}</div>
  ${tipHtml}
</div>`;
}

function renderBar(evt, pos) {
    const cls  = ` md-calendar-event--holiday-${pos}`;
    const text = (pos === 'start' || pos === 'single') ? escapeHtml(evt.content) : '';
    return `<div class="md-calendar-event md-calendar-event--holiday ${BAR_STYLE.cls}${cls}" style="--evt-bg:${BAR_STYLE.bg};--evt-text:${BAR_STYLE.text}">${text}</div>`;
}

function parseEvents(node) {
    const table = findTableNode(node);
    if (!table) return [];
    const rows = table.children.filter(c => c.type === 'tableRow');
    if (rows.length < 2) return [];
    const headers = rows[0].children
        .filter(c => c.type === 'tableCell')
        .map(c => extractText(c).trim().toLowerCase());
    const di = headers.indexOf('date');
    const ti = headers.indexOf('type');
    const ci = headers.indexOf('content');
    const coi = headers.indexOf('color');
    const li = headers.indexOf('link');
    const out = [];
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].children.filter(c => c.type === 'tableCell');
        out.push({
            date:    di >= 0 ? extractText(cells[di]).trim() : '',
            type:    ti >= 0 ? extractText(cells[ti]).trim() : '',
            content: ci >= 0 ? extractText(cells[ci]).trim() : '',
            color:   coi >= 0 && cells[coi] ? extractText(cells[coi]).trim() : '',
            link:    li >= 0 && cells[li] ? extractText(cells[li]).trim() : '',
        });
    }
    return out;
}

function normalizeDate(s) {
    if (!s) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{2}-\d{2}$/.test(s)) {
        return `${new Date().getFullYear()}-${s}`;
    }
    if (/^\d{1,2}$/.test(s)) {
        const n = new Date();
        return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(s).padStart(2,'0')}`;
    }
    return null;
}

function generateMonthRange(month, range) {
    const [y, m] = month.split('-').map(Number);
    const out = [];
    for (let i = -range; i <= range; i++) {
        let mm = m + i, yy = y;
        while (mm < 1) { mm += 12; yy -= 1; }
        while (mm > 12) { mm -= 12; yy += 1; }
        out.push(`${yy}-${String(mm).padStart(2, '0')}`);
    }
    return out;
}

function formatMonth(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`;
}

function formatMonthLabel(s) {
    const [y, m] = s.split('-');
    return `${y}年${parseInt(m)}月`;
}

function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
}

function findTableNode(node) {
    if (node.type === 'table') return node;
    if (node.children) {
        for (const c of node.children) {
            const f = findTableNode(c);
            if (f) return f;
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

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
        ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
