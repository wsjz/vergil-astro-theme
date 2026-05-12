/**
 * Inline directive processors (textDirective).
 *
 * Handles: :mark[] :kbd[] :blur[] :psw[] :u[] :emp[] :wavy[] :del[]
 *          :sup[] :sub[] :hashtag[] :button[] :step-brackets[]
 *          :checkbox[] :radio[] :emoji[]
 */
import { getIconSvg, resolveColor, escapeHtml, HASHTAG_COLORS, EMOJI_SOURCES } from './shared.mjs';

let hashtagIndex = 0;

export function processInlineDirective(node) {
    const name = node.name;
    const attrs = node.attributes || {};
    const text = node.children?.map(c => c.value || '').join('') || '';

    switch (name) {
        case 'mark': {
            const bg = resolveColor(attrs.color || 'yellow');
            const bgAlpha = bg.startsWith('var(') ? `color-mix(in srgb,${bg} 30%,transparent)` : bg + '55';
            node.data = { hName: 'mark', hProperties: { class: 'md-tag-mark', style: `--tag-mark-bg:${bgAlpha};--tag-mark-color:${bg}` } };
            break;
        }
        case 'kbd':
            node.data = { hName: 'kbd', hProperties: { class: 'md-tag-kbd' } };
            break;
        case 'blur':
            node.data = { hName: 'span', hProperties: { class: 'md-tag-blur', onclick: "this.classList.toggle('md-tag-blur--revealed')" } };
            break;
        case 'psw':
            node.data = { hName: 'span', hProperties: { class: 'md-tag-psw', onclick: "this.classList.toggle('md-tag-psw--revealed')" } };
            break;
        case 'u':
            node.data = { hName: 'u', hProperties: { class: 'md-tag-u', style: `--tag-u-color:${resolveColor(attrs.color || 'accent')}` } };
            break;
        case 'emp':
            node.data = { hName: 'span', hProperties: { class: 'md-tag-emp', style: `--tag-emp-color:${resolveColor(attrs.color || 'accent')}` } };
            break;
        case 'wavy':
            node.data = { hName: 'span', hProperties: { class: 'md-tag-wavy', style: `--tag-wavy-color:${resolveColor(attrs.color || 'accent')}` } };
            break;
        case 'del':
            node.data = { hName: 'del', hProperties: { class: 'md-tag-del' } };
            break;
        case 'sup':
            node.data = { hName: 'sup', hProperties: { class: 'md-tag-sup', style: `--tag-sup-color:${resolveColor(attrs.color || 'accent')}` } };
            break;
        case 'sub':
            node.data = { hName: 'sub', hProperties: { class: 'md-tag-sub', style: `--tag-sub-color:${resolveColor(attrs.color || 'accent')}` } };
            break;
        case 'hashtag': {
            let color = attrs.color ? resolveColor(attrs.color) : '';
            if (!color) {
                color = resolveColor(HASHTAG_COLORS[hashtagIndex]);
                hashtagIndex = (hashtagIndex + 1) % HASHTAG_COLORS.length;
            }
            const hashIcon = '<svg class="md-hash-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M426.6 64.8c34.8 5.8 58.4 38.8 52.6 73.6l-19.6 117.6h190.2l23-138.6c5.8-34.8 38.8-58.4 73.6-52.6s58.4 38.8 52.6 73.6l-19.4 117.6H896c35.4 0 64 28.6 64 64s-28.6 64-64 64h-137.8l-42.6 256H832c35.4 0 64 28.6 64 64s-28.6 64-64 64h-137.8l-23 138.6c-5.8 34.8-38.8 58.4-73.6 52.6s-58.4-38.8-52.6-73.6l19.6-117.4h-190.4l-23 138.6c-5.8 34.8-38.8 58.4-73.6 52.6s-58.4-38.8-52.6-73.6l19.4-117.8H128c-35.4 0-64-28.6-64-64s28.6-64 64-64h137.8l42.6-256H192c-35.4 0-64-28.6-64-64s28.6-64 64-64h137.8l23-138.6c5.8-34.8 38.8-58.4 73.6-52.6z m11.6 319.2l-42.6 256h190.2l42.6-256h-190.2z"/></svg>';
            node.data = { hName: 'a', hProperties: { href: attrs.href || '#', class: 'md-tag-hashtag', style: `--tag-hash-color:${color}` } };
            node.children = [
                { type: 'html', value: `<span class="md-hash-icon">${hashIcon}</span>` },
                { type: 'text', value: text }
            ];
            break;
        }
        case 'button': {
            const color = resolveColor(attrs.color || 'accent');
            const href = attrs.href || '#';
            const icon = attrs.icon || '';
            const size = attrs.size || '';
            const classes = ['md-tag-button'];
            if (size === 'xs') classes.push('md-btn-xs');
            node.data = { hName: 'a', hProperties: { href, class: classes.join(' '), style: `--tag-btn-bg:${color}` } };
            const children = [];
            if (icon) {
                if (/^https?:\/\//i.test(icon)) {
                    children.push({ type: 'html', value: `<img class="md-btn-icon" src="${icon}" alt="" />` });
                } else {
                    const iconifyMatch = icon.match(/^([a-z0-9-]+):([a-z0-9-]+)$/i);
                    if (iconifyMatch) {
                        children.push({ type: 'html', value: `<span class="md-btn-icon">${getIconSvg(icon, '1.2em')}</span>` });
                    } else {
                        children.push({ type: 'text', value: icon });
                    }
                }
            }
            children.push({ type: 'text', value: text });
            node.children = children;
            break;
        }
        case 'step-brackets': {
            const num = text;
            const title = attrs.title || '';
            node.data = { hName: 'div', hProperties: { class: 'md-step-brackets' } };
            node.children = [
                { type: 'html', value: `<span class="md-step-badge">${num}</span>` },
                ...(title ? [{ type: 'html', value: `<span class="md-step-title">${title}</span>` }] : [])
            ];
            break;
        }
        case 'checkbox': {
            const color = resolveColor(attrs.color || 'blue');
            const symbol = attrs.symbol || '';
            const checked = attrs.checked === 'true' || attrs.checked === '';
            const inline = attrs.inline === 'true' || attrs.inline === '';
            const classes = ['md-tag-checkbox'];
            if (symbol) classes.push(`md-checkbox-symbol-${symbol}`);
            if (inline) classes.push('md-checkbox-inline');
            node.data = {
                hName: inline ? 'span' : 'div',
                hProperties: {
                    class: classes.join(' '),
                    'data-checked': checked ? 'true' : 'false',
                    style: `--checkbox-color:${color}`
                }
            };
            node.children = [
                { type: 'html', value: '<span class="md-checkbox-box"></span>' },
                { type: 'text', value: text }
            ];
            break;
        }
        case 'radio': {
            const color = resolveColor(attrs.color || 'blue');
            const checked = attrs.checked === 'true' || attrs.checked === '';
            const inline = attrs.inline === 'true' || attrs.inline === '';
            const classes = ['md-tag-checkbox', 'md-tag-radio'];
            if (inline) classes.push('md-checkbox-inline');
            node.data = {
                hName: inline ? 'span' : 'div',
                hProperties: {
                    class: classes.join(' '),
                    'data-checked': checked ? 'true' : 'false',
                    style: `--checkbox-color:${color}`
                }
            };
            node.children = [
                { type: 'html', value: '<span class="md-checkbox-box"></span>' },
                { type: 'text', value: text }
            ];
            break;
        }
        case 'emoji': {
            const height = attrs.height || '1.75em';
            let source = attrs.source;
            let emojiName = attrs.name;

            if (source === undefined) {
                const firstSource = Object.keys(EMOJI_SOURCES)[0];
                if (firstSource) {
                    emojiName = text;
                    source = firstSource;
                }
            }
            if (!emojiName) emojiName = text;

            if (source && emojiName) {
                const template = EMOJI_SOURCES[source] || source;
                const url = template.replace('{name}', emojiName);
                node.data = {
                    hName: 'span',
                    hProperties: { class: 'md-tag-emoji', style: `--emoji-height:${height}` }
                };
                node.children = [
                    { type: 'html', value: `<img src="${url}" alt="${emojiName}" loading="lazy" style="height:${height}" />` }
                ];
            }
            break;
        }
        default:
            break;
    }

    return node;
}
