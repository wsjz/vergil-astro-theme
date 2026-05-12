/**
 * Directive plugin shared utilities and constants.
 *
 * Used by all directive processor modules.
 */
import bx from '@iconify-json/bx/icons.json' with { type: 'json' };
import lucide from '@iconify-json/lucide/icons.json' with { type: 'json' };
import solar from '@iconify-json/solar/icons.json' with { type: 'json' };
import crypto from 'node:crypto';
import QRCode from 'qrcode-svg';

export const ICON_SETS = { lucide, bx, solar };
export const SET_ALIASES = { bxs: 'bx', bxl: 'bx' };
export const SET_PREFIXES = { bxs: 'bxs-', bxl: 'bxl-' };

export const EMOJI_SOURCES = {
    default: 'https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/qq/{name}.gif',
    qq: 'https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/qq/{name}.gif',
    aru: 'https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/aru/{name}.gif',
    tieba: 'https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/tieba/{name}.png',
    blobcat: 'https://gcore.jsdelivr.net/gh/cdn-x/emoticons@3.1/blobcat/{name}.gif',
    twemoji: 'https://gcore.jsdelivr.net/gh/twitter/twemoji/assets/svg/{name}.svg',
};

export const HASHTAG_COLORS = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];

export const NAMED_COLORS = {
    red: '#ef4444', orange: '#f97316', yellow: '#eab308',
    green: '#22c55e', blue: '#3b82f6', purple: '#a855f7',
    pink: '#ec4899', cyan: '#06b6d4',
    accent: 'var(--accent-color,#4a7c59)',
};

/** Get Iconify SVG string */
export function getIconSvg(name, size = '1em') {
    const [rawSet, iconName] = name.split(':');
    const set = SET_ALIASES[rawSet] || rawSet;
    const prefixedName = (SET_PREFIXES[rawSet] || '') + iconName;
    const data = ICON_SETS[set]?.icons?.[prefixedName] || ICON_SETS[set]?.icons?.[iconName];
    if (!data) return '';
    const { body, width = 24, height = 24 } = data;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${width} ${height}" fill="currentColor">${body}</svg>`;
}

/** Resolve color name to CSS value */
export function resolveColor(c) {
    return NAMED_COLORS[c] || c || 'var(--accent-color,#4a7c59)';
}

/** Create a hast container node */
export function h(tagName, properties, children) {
    return {
        type: 'container',
        data: { hName: tagName, hProperties: properties || {} },
        children: children || []
    };
}

/** HTML escape */
export function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** Serialize AST nodes to HTML string */
export function serializeToHtml(nodes) {
    if (!Array.isArray(nodes)) nodes = [nodes];
    return nodes.map(node => {
        if (!node) return '';
        switch (node.type) {
            case 'text': return escapeHtml(node.value || '');
            case 'inlineCode': return `<code>${escapeHtml(node.value || '')}</code>`;
            case 'strong': return `<strong>${serializeToHtml(node.children)}</strong>`;
            case 'emphasis': return `<em>${serializeToHtml(node.children)}</em>`;
            case 'delete': return `<del>${serializeToHtml(node.children)}</del>`;
            case 'link': return `<a href="${node.url || '#'}">${serializeToHtml(node.children)}</a>`;
            case 'image': return `<img src="${node.url || ''}" alt="${node.alt || ''}" loading="lazy" />`;
            case 'break': return '<br>';
            case 'paragraph': return `<p>${serializeToHtml(node.children)}</p>`;
            case 'heading': return `<h${node.depth || 2}>${serializeToHtml(node.children)}</h${node.depth || 2}>`;
            case 'code': return `<pre><code class="language-${node.lang || ''}">${escapeHtml(node.value || '')}</code></pre>`;
            case 'blockquote': return `<blockquote>${serializeToHtml(node.children)}</blockquote>`;
            case 'list': {
                const tag = node.ordered ? 'ol' : 'ul';
                return `<${tag}>${node.children.map(item => `<li>${serializeToHtml(item.children)}</li>`).join('')}</${tag}>`;
            }
            case 'listItem': return serializeToHtml(node.children);
            case 'thematicBreak': return '<hr>';
            case 'html': return node.value || '';
            case 'container': return serializeToHtml(node.children);
            default: return '';
        }
    }).join('');
}

/** Encrypt private content with AES-256-CBC */
export function encryptPrivateContent(text, password) {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const payload = Buffer.concat([salt, iv, Buffer.from(encrypted, 'base64')]);
    return payload.toString('base64');
}

/** Check if background color is light */
export function isLightBg(bgColor) {
    if (!bgColor) return true;
    const c = bgColor.trim().toLowerCase();
    const hexMatch = c.match(/^#([0-9a-f]{3,8})$/);
    if (hexMatch) {
        let hex = hexMatch[1];
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        if (hex.length === 8) hex = hex.slice(0, 6);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return luma > 0.6;
    }
    const darkNames = ['black', 'navy', 'darkblue', 'darkred', 'darkgreen', 'maroon', 'midnightblue', 'darkslategray', 'darkslateblue'];
    if (darkNames.includes(c)) return false;
    return true;
}

/** Convert hex to HSL */
export function hexToHsl(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt('0x' + hex[1] + hex[1]);
        g = parseInt('0x' + hex[2] + hex[2]);
        b = parseInt('0x' + hex[3] + hex[3]);
    } else if (hex.length === 7) {
        r = parseInt('0x' + hex[1] + hex[2]);
        g = parseInt('0x' + hex[3] + hex[4]);
        b = parseInt('0x' + hex[5] + hex[6]);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Calculate label text color from background */
export function labelTextColor(hex) {
    const { h, s, l } = hexToHsl(hex);
    if (l > 75) return `hsla(${h}, ${s}%, 20%, 1)`;
    if (s > 90 && l > 40) return `hsla(${h}, 50%, 20%, 1)`;
    return 'white';
}

/** Get website screenshot URL */
export function getScreenshotUrl(url, service) {
    if (service === 'mshots') {
        return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=720`;
    }
    return `https://image.thum.io/get/width/1280/crop/720/${url}`;
}
