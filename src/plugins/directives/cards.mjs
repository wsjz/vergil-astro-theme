import { getIconSvg, resolveColor, escapeHtml, h, isLightBg, labelTextColor, getScreenshotUrl } from './shared.mjs';
import QRCode from 'qrcode-svg';

export function processCardDirective(node, options = {}) {
    const { links, screenshotService } = options;
    const attrs = node.attributes || {};

    switch (node.name) {
        case 'ghcard': {
            const type = attrs.type || 'repo';
            const repo = attrs.repo || '';
            const user = attrs.user || '';

            if (type === 'repo' && repo) {
                const apiUrl = `https://api.github.com/repos/${repo}`;
                const tagsApi = `https://api.github.com/repos/${repo}/tags`;
                const html = `<div class="md-directive md-directive-ghcard md-ghcard-repo" data-api="${apiUrl}" data-tags-api="${tagsApi}">
  <a class="md-ghcard-link" href="https://github.com/${repo}" target="_blank" rel="external nofollow noopener noreferrer">
    <div class="md-ghcard-header">
      <span class="md-ghcard-icon">${getIconSvg('lucide:git-fork', 16)}</span>
      <span class="md-ghcard-name">${repo}</span>
    </div>
    <div class="md-ghcard-desc"><span class="md-ghcard-text" data-key="description">&nbsp;</span></div>
    <div class="md-ghcard-stats">
      <div class="md-ghcard-stat">
        <span class="md-ghcard-stat-icon">${getIconSvg('lucide:star', 14)}</span>
        <span class="md-ghcard-text" data-key="stargazers_count">0</span>
      </div>
      <div class="md-ghcard-stat">
        <span class="md-ghcard-stat-icon">${getIconSvg('lucide:git-fork', 14)}</span>
        <span class="md-ghcard-text" data-key="forks_count">0</span>
      </div>
      <div class="md-ghcard-stat">
        <span class="md-ghcard-stat-icon">${getIconSvg('lucide:tag', 14)}</span>
        <span class="md-ghcard-text" data-key="latest-tag-name">-</span>
      </div>
    </div>
  </a>
</div>`;
                node.data = { hName: 'div', hProperties: {} };
                node.children = [{ type: 'html', value: html }];
            } else if (type === 'user' && user) {
                const apiUrl = `https://api.github.com/users/${user}`;
                const bio = attrs.bio || '';
                const showAvatar = attrs.avatar !== 'false';
                const bioHtml = bio ? `<p class="md-ghcard-bio" data-key="bio">${bio}</p>` : '';
                const avatarHtml = showAvatar ? `<div class="md-ghcard-avatar"><img data-key="avatar_url" src="https://github.com/identicons/${user}.png" alt="${user}" loading="lazy" /></div>` : '';
                const html = `<div class="md-directive md-directive-ghcard md-ghcard-user" data-api="${apiUrl}">
  <div class="md-ghcard-user-body">
    ${avatarHtml}
    <p class="md-ghcard-username" data-key="name">${user}</p>
    ${bioHtml}
    <div class="md-ghcard-user-stats">
      <a class="md-ghcard-user-stat" href="https://github.com/${user}?tab=followers" target="_blank" rel="external nofollow noopener noreferrer">
        <span class="md-ghcard-text" data-key="followers">0</span>
        <span class="md-ghcard-stat-label">followers</span>
      </a>
      <a class="md-ghcard-user-stat" href="https://github.com/${user}?tab=following" target="_blank" rel="external nofollow noopener noreferrer">
        <span class="md-ghcard-text" data-key="following">0</span>
        <span class="md-ghcard-stat-label">following</span>
      </a>
      <a class="md-ghcard-user-stat" href="https://github.com/${user}?tab=repositories" target="_blank" rel="external nofollow noopener noreferrer">
        <span class="md-ghcard-text" data-key="public_repos">0</span>
        <span class="md-ghcard-stat-label">repos</span>
      </a>
    </div>
    <a class="md-ghcard-follow" href="https://github.com/${user}" target="_blank" rel="external nofollow noopener noreferrer">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .999c-6.074 0-11 5.05-11 11.278c0 4.983 3.152 9.21 7.523 10.702c.55.104.727-.246.727-.543v-2.1c-3.06.683-3.697-1.33-3.697-1.33c-.5-1.304-1.222-1.65-1.222-1.65c-.998-.7.076-.686.076-.686c1.105.08 1.686 1.163 1.686 1.163c.98 1.724 2.573 1.226 3.201.937c.098-.728.383-1.226.698-1.508c-2.442-.286-5.01-1.253-5.01-5.574c0-1.232.429-2.237 1.132-3.027c-.114-.285-.49-1.432.107-2.985c0 0 .924-.303 3.026 1.156c.877-.25 1.818-.375 2.753-.38c.935.005 1.876.13 2.755.38c2.1-1.459 3.023-1.156 3.023-1.156c.598 1.554.222 2.701.108 2.985c.706.79 1.132 1.796 1.132 3.027c0 4.332-2.573 5.286-5.022 5.565c.394.35.754 1.036.754 2.088v3.095c0 .3.176.652.734.542C19.852 21.484 23 17.258 23 12.277C23 6.048 18.075.999 12 .999"/></svg>
      Follow
    </a>
  </div>
</div>`;
                node.data = { hName: 'div', hProperties: {} };
                node.children = [{ type: 'html', value: html }];
            } else {
                node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-ghcard' } };
                node.children = [{ type: 'html', value: '<p style="color:var(--text-secondary);font-size:0.875rem;">Please provide a valid repo (e.g. owner/repo) or user attribute</p>' }];
            }
            break;
        }

        case 'sites': {
            const group = attrs.group || '';
            const items = (links && links[group]) || [];

            if (!group) {
                node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-sites' } };
                node.children = [{ type: 'html', value: '<p style="color:var(--text-secondary);font-size:0.875rem;">Please provide a group attribute, e.g. :::sites{group="friends"}</p>' }];
            } else if (items.length === 0) {
                node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-sites' } };
                node.children = [{ type: 'html', value: `<p style="color:var(--text-secondary);font-size:0.875rem;">Group "${group}" has no site data</p>` }];
            } else {
                const cells = items.map(item => {
                    const cover = item.cover || getScreenshotUrl(item.url, screenshotService);
                    const icon = item.icon || `${new URL(item.url).origin}/favicon.ico`;
                    const desc = item.description || item.url;
                    let labelsHtml = '';
                    if (item.labels && item.labels.length > 0) {
                        labelsHtml = '<div class="md-sites-labels">' +
                            item.labels.map(l => {
                                const color = l.color || '#3b82f6';
                                const textColor = labelTextColor(color);
                                return `<span class="md-sites-label" style="background:${color};color:${textColor}">${l.name}</span>`;
                            }).join('') +
                            '</div>';
                    }
                    return `<div class="md-sites-cell">` +
                        `<a class="md-sites-link" href="${item.url}" target="_blank" rel="external nofollow noopener noreferrer">` +
                        `<div class="md-sites-cover">` +
                        `<img src="${cover}" alt="${item.title}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('md-sites-cover-fallback');" />` +
                        `</div>` +
                        `<div class="md-sites-info">` +
                        `<img class="md-sites-icon" src="${icon}" alt="" loading="lazy" onerror="this.style.display='none'" />` +
                        `<span class="md-sites-title">${item.title}</span>` +
                        `<span class="md-sites-desc">${desc}</span>` +
                        `</div>` +
                        labelsHtml +
                        `</a>` +
                        `</div>`;
                }).join('');

                const html = `<div class="md-directive md-directive-sites"><div class="md-sites-grid">${cells}</div></div>`;
                node.data = { hName: 'div', hProperties: {} };
                node.children = [{ type: 'html', value: html }];
            }
            break;
        }

        case 'posters': {
            const group = attrs.group || '';
            const ratio = attrs.ratio || 'portrait';
            const cols = attrs.cols || '';
            const items = (links && links[group]) || [];

            if (!group) {
                node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-posters' } };
                node.children = [{ type: 'html', value: '<p style="color:var(--text-secondary);font-size:0.875rem;">Please provide a group attribute, e.g. :::posters{group="movies"}</p>' }];
            } else if (items.length === 0) {
                node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-posters' } };
                node.children = [{ type: 'html', value: `<p style="color:var(--text-secondary);font-size:0.875rem;">Group "${group}" has no poster data</p>` }];
            } else {
                const cells = items.map(item => {
                    const cover = item.cover || item.icon || '';
                    const title = item.title || '';
                    return `<div class="md-posters-cell">` +
                        (item.url
                            ? `<a class="md-posters-link" href="${item.url}" target="_blank" rel="external nofollow noopener noreferrer">`
                            : `<div class="md-posters-link">`) +
                        `<div class="md-posters-cover">` +
                        (cover
                            ? `<img src="${cover}" alt="${title}" loading="lazy" onerror="this.style.display='none'" />`
                            : '') +
                        `</div>` +
                        `<div class="md-posters-meta">` +
                        (title ? `<span class="md-posters-caption">${title}</span>` : '') +
                        `</div>` +
                        (item.url ? `</a>` : `</div>`) +
                        `</div>`;
                }).join('');

                const html = `<div class="md-directive md-directive-posters" data-ratio="${ratio}"${cols ? ` data-cols="${cols}"` : ''}><div class="md-posters-grid">${cells}</div></div>`;
                node.data = { hName: 'div', hProperties: {} };
                node.children = [{ type: 'html', value: html }];
            }
            break;
        }

        case 'panel': {
            const segments = [];
            let currentLeft = '';
            let currentRight = '';
            let currentContent = [];

            for (const child of node.children) {
                let match = null;
                if (child.type === 'html' && child.value) {
                    match = child.value.match(/<!--\s*label:\s*(.*?)\s*-->/);
                }
                if (!match && child.type === 'paragraph' && child.children && child.children.length > 0) {
                    const firstChild = child.children[0];
                    if (firstChild.type === 'html' && firstChild.value) {
                        match = firstChild.value.match(/<!--\s*label:\s*(.*?)\s*-->/);
                        if (match && child.children.length === 1) {
                            continue;
                        }
                    }
                }
                if (match) {
                    if (currentContent.length > 0) {
                        segments.push({ left: currentLeft, right: currentRight, children: currentContent });
                    }
                    const parts = match[1].split('|').map(s => s.trim());
                    currentLeft = parts[0] || '';
                    currentRight = parts[1] || '';
                    currentContent = [];
                    continue;
                }
                if (child.type === 'code') {
                    const meta = child.meta || '';
                    const titleMatch = meta.match(/title=["']([^"']+)["']/);
                    const rightMatch = meta.match(/right=["']([^"']+)["']/);
                    const left = titleMatch ? titleMatch[1] : (child.lang || '');
                    const right = rightMatch ? rightMatch[1] : '';
                    if (currentContent.length > 0) {
                        segments.push({ left: currentLeft, right: currentRight, children: currentContent });
                        currentContent = [];
                        currentLeft = '';
                        currentRight = '';
                    }
                    segments.push({ left, right, children: [child] });
                    continue;
                }
                currentContent.push(child);
            }
            if (currentContent.length > 0) {
                segments.push({ left: currentLeft, right: currentRight, children: currentContent });
            }

            const uid = `panel-${Math.random().toString(36).slice(2, 7)}`;
            const copyIcon = getIconSvg('lucide:copy', 14);
            const children = [];
            children.push({ type: 'html', value: '<div class="md-panel-body">' });
            for (let i = 0; i < segments.length; i++) {
                const seg = segments[i];
                const segUid = `${uid}-seg-${i}`;
                const isCode = seg.children.some(c => c.type === 'code');
                let segCopyText = '';
                for (const c of seg.children) {
                    if (c.type === 'code') {
                        segCopyText = c.value;
                    }
                }
                const safeSegCopyText = segCopyText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const leftLabel = seg.left ? `<span class="md-segment-label-left">${seg.left}</span>` : '';
                const rightHtml = seg.right ? `<span class="md-segment-right">${seg.right}</span>` : '';
                const copyHtml = segCopyText ? `<button class="md-copy-btn md-segment-copy" data-copy-target="${segUid}" aria-label="Copy">${copyIcon}</button>` : '';
                const metaHtml = (rightHtml || copyHtml) ? `<div class="md-segment-meta">${rightHtml}${copyHtml}</div>` : '';
                const headerHtml = (leftLabel || metaHtml) ? `<div class="md-segment-header">${leftLabel}${metaHtml}</div>` : '';
                children.push({ type: 'html', value: `<div class="md-panel-segment">${headerHtml}` });
                children.push(...seg.children);
                children.push({ type: 'html', value: '</div>' });
                if (segCopyText) {
                    children.push({
                        type: 'html',
                        value: `<textarea id="${segUid}" class="md-copy-source" readonly style="position:absolute;left:-9999px;opacity:0;pointer-events:none;">${safeSegCopyText}</textarea>`
                    });
                }
                if (i < segments.length - 1) {
                    children.push({ type: 'html', value: '<div class="md-panel-divider"></div>' });
                }
            }
            children.push({ type: 'html', value: '</div>' });
            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-panel' } };
            node.children = children;
            break;
        }

        case 'yoicard': {
            const ycName = attrs.name || '';
            const ycRole = attrs.role || '';

            if (!ycName) {
                node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-yoicard md-yc-error' } };
                node.children = [{ type: 'html', value: '<p style="color:var(--text-secondary);font-size:0.875rem;">Please provide a <code>name</code> attribute, e.g. :::yoicard{name="..."}</p>' }];
                return;
            }

            const bgImage = attrs['bg-image'] || '';
            const bgGradient = attrs['bg-gradient'] || '';
            const bgPattern = attrs['bg-pattern'] || '';
            const bgColor = attrs.bg || '';
            const bgMode = attrs['bg-mode'] || 'full';
            const bgOverlay = attrs['bg-overlay'] || 'dark';

            const cardClasses = ['md-directive', 'md-directive-yoicard'];
            let cardStyle = '';

            if (bgImage) {
                cardClasses.push('md-yc-has-image');
                cardClasses.push(`md-yc-bg-mode-${bgMode}`);
                const safeBgImage = bgImage.replace(/'/g, "\\'");
                cardStyle += `--yc-bg-image:url('${safeBgImage}');`;
                if (bgMode === 'full' && bgOverlay !== 'none') {
                    const overlayMap = {
                        dark: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)',
                        light: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.7) 100%)'
                    };
                    const overlay = overlayMap[bgOverlay] || `linear-gradient(${bgOverlay}, ${bgOverlay})`;
                    cardStyle += `--yc-bg-overlay:${overlay};`;
                }
            } else if (bgGradient) {
                cardClasses.push('md-yc-has-gradient');
                const gradient = /^(linear|radial|conic)-gradient/.test(bgGradient.trim()) ? bgGradient : `linear-gradient(${bgGradient})`;
                cardStyle += `--yc-bg-gradient:${gradient};`;
            } else if (bgPattern) {
                const validPatterns = ['diagonal', 'dots', 'grid', 'grain'];
                const pattern = validPatterns.includes(bgPattern) ? bgPattern : 'diagonal';
                cardClasses.push('md-yc-has-pattern', `md-yc-pattern-${pattern}`);
            } else if (bgColor) {
                cardClasses.push('md-yc-has-color');
                cardStyle += `--yc-bg-color:${bgColor};`;
            }

            const textAttr = attrs.text || 'auto';
            let isLight;
            if (textAttr === 'light') isLight = false;
            else if (textAttr === 'dark') isLight = true;
            else if (textAttr === 'auto') {
                if (bgImage && bgMode === 'full' && bgOverlay !== 'light') isLight = false;
                else if (bgImage && bgMode === 'full' && bgOverlay === 'light') isLight = true;
                else if (bgGradient) isLight = true;
                else if (bgColor) isLight = isLightBg(bgColor);
                else isLight = true;
            } else if (/^#/.test(textAttr)) {
                cardStyle += `--yc-text:${textAttr};`;
                isLight = true;
            } else {
                isLight = true;
            }

            if (!isLight) {
                cardClasses.push('md-yc-text-light');
            }

            const fontName = attrs['font-name'] || '';
            const fontBody = attrs['font-body'] || '';
            if (fontName) cardStyle += `--yc-font-name:${fontName};`;
            if (fontBody) cardStyle += `--yc-font-body:${fontBody};`;

            const nameColor = attrs['name-color'] || '';
            const roleColor = attrs['role-color'] || '';
            if (nameColor) cardStyle += `--yc-name-color:${nameColor};`;
            if (roleColor) cardStyle += `--yc-role-color:${roleColor};`;

            const qrAttr = attrs.qr || '';
            let qrHtml = '';
            if (qrAttr) {
                const qr = new QRCode({
                    content: qrAttr, padding: 0, width: 64, height: 64,
                    color: '#111', background: '#fff', ecl: 'M', join: true, container: 'svg-viewbox'
                });
                const svgContent = qr.svg().replace(/\u003c\?xml[^\u003e]*\?\u003e\s*/, '');
                qrHtml = `<div class="md-yc-qr">${svgContent}</div>`;
                cardClasses.push('md-yc-has-qr');
            }

            const accentColor = attrs.accent || '';
            if (accentColor) cardStyle += `--yc-accent:${accentColor};`;

            const iconAttr = attrs.icon || '';
            let accentHtml = '<span class="md-yc-accent-line"></span>';
            if (iconAttr) {
                const svg = getIconSvg(iconAttr, '16px');
                if (svg) accentHtml = `<span class="md-yc-accent-icon">${svg}</span>`;
            }

            const logoAttr = attrs.logo || '';
            const logoShape = attrs['logo-shape'] || 'circle';
            let logoHtml = '';
            if (logoAttr) {
                const shapeClass = `md-yc-logo-${['circle', 'square', 'rounded'].includes(logoShape) ? logoShape : 'circle'}`;
                logoHtml = `<img class="md-yc-logo ${shapeClass}" src="${escapeHtml(logoAttr)}" alt="" loading="lazy" onerror="this.style.display='none'" />`;
            }

            const originalChildren = node.children || [];
            const bioChildren = [];
            const contactChildren = [];
            let inContact = false;

            function isContactMarker(child) {
                if (child.type === 'html' && child.value) {
                    return /<!--\s*contact\s*-->/.test(child.value);
                }
                if (child.type === 'paragraph' && child.children && child.children.length === 1) {
                    const first = child.children[0];
                    if (first.type === 'html' && first.value && /<!--\s*contact\s*-->/.test(first.value)) {
                        return true;
                    }
                }
                return false;
            }

            for (const child of originalChildren) {
                if (!inContact && isContactMarker(child)) {
                    inContact = true;
                    continue;
                }
                if (inContact) {
                    contactChildren.push(child);
                } else {
                    bioChildren.push(child);
                }
            }

            const meaningfulBioChildren = bioChildren.filter(child => {
                if (child.type === 'paragraph') {
                    const text = (child.children || []).map(c => c.value || '').join('');
                    return text.trim().length > 0;
                }
                return true;
            });

            const normalizedContactChildren = contactChildren.map(child => {
                if (child.type === 'heading') {
                    return { type: 'paragraph', children: child.children, data: { hName: 'div' } };
                }
                return child;
            });

            const bodyChildren = [];
            bodyChildren.push({
                type: 'html',
                value: `<header class="md-yc-top"><div class="md-yc-name">${escapeHtml(ycName)}</div>${ycRole ? `<div class="md-yc-role">${escapeHtml(ycRole)}</div>` : ''}</header>`
            });

            if (meaningfulBioChildren.length > 0) {
                bodyChildren.push({ type: 'html', value: '<div class="md-yc-bio">' });
                bodyChildren.push(...meaningfulBioChildren);
                bodyChildren.push({ type: 'html', value: '</div>' });
            }

            if (normalizedContactChildren.length > 0 || qrHtml) {
                bodyChildren.push({ type: 'html', value: '<footer class="md-yc-contact">' });
                if (normalizedContactChildren.length > 0) {
                    bodyChildren.push({ type: 'html', value: '<div class="md-yc-contact-text">' });
                    bodyChildren.push(...normalizedContactChildren);
                    bodyChildren.push({ type: 'html', value: '</div>' });
                }
                if (qrHtml) {
                    bodyChildren.push({ type: 'html', value: qrHtml });
                }
                bodyChildren.push({ type: 'html', value: '</footer>' });
            }

            const hProps = { class: cardClasses.join(' ') };
            if (cardStyle) hProps.style = cardStyle;
            node.data = { hName: 'div', hProperties: hProps };
            node.children = [
                { type: 'html', value: `<div class="md-yc-accent">${accentHtml}</div>` },
                { type: 'html', value: logoHtml },
                { type: 'html', value: '<div class="md-yc-body">' },
                ...bodyChildren,
                { type: 'html', value: '</div>' }
            ];
            break;
        }
    }
}
