import { getIconSvg, resolveColor, escapeHtml } from './shared.mjs';

export function processMediaDirective(node) {
    const name = node.name;
    const attrs = node.attributes || {};

    if (name === 'video') {
        const src = attrs.src || '';
        const bilibili = attrs.bilibili || '';
        const youtube = attrs.youtube || '';
        const poster = attrs.poster || '';
        const ratio = attrs.ratio || '16/9';
        const width = attrs.width || '';
        const align = attrs.align || '';
        const autoplay = attrs.autoplay === 'true' || attrs.autoplay === '';
        const pip = attrs.pip || 'auto';

        function ratioToPadding(r) {
            const parts = r.split('/').map(Number);
            if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
                return (parts[1] / parts[0] * 100).toFixed(4) + '%';
            }
            return '56.25%';
        }
        const ratioPct = ratioToPadding(ratio);
        let containerStyle = `--video-ratio-pct:${ratioPct};`;
        if (width) containerStyle += `--video-width:${width};`;
        if (align) containerStyle += `--video-align:${align};`;

        const uid = `video-${Math.random().toString(36).slice(2, 7)}`;
        const playIcon = getIconSvg('lucide:play', 36);

        if (src) {
            let videoHtml;
            const pipBtnIcon = getIconSvg('lucide:picture-in-picture', 16);
            const pipBtnHtml = pip === 'manual'
                ? `<button type="button" class="md-video-pip-btn" data-video-pip="${uid}" aria-label="Picture-in-picture">${pipBtnIcon}</button>`
                : '';
            if (poster) {
                videoHtml = `<img class="md-video-poster-img" src="${poster}" alt="" loading="lazy" onerror="this.style.display='none'" /><video class="md-video-element" id="${uid}" src="${src}" preload="metadata" playsinline disablePictureInPicture ${autoplay ? 'autoplay muted ' : ''}data-pip-video="${uid}" data-pip-mode="${pip}"></video><div class="md-video-overlay" data-video-id="${uid}"><button type="button" class="md-video-play-btn" data-video-play="${uid}" aria-label="Play">${playIcon}</button></div>${pipBtnHtml}`;
                node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-video md-video-has-poster', style: containerStyle } };
            } else {
                videoHtml = `<video class="md-video-element" id="${uid}" src="${src}" controls preload="metadata" playsinline disablePictureInPicture ${autoplay ? 'autoplay muted ' : ''}data-pip-video="${uid}" data-pip-mode="${pip}"></video>${pipBtnHtml}`;
                node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-video', style: containerStyle } };
            }
            node.children = [{ type: 'html', value: `<div class="md-video-wrap">${videoHtml}</div>` }];
        } else if (bilibili) {
            const bvid = bilibili.startsWith('BV') ? bilibili : 'BV' + bilibili;
            const iframeSrc = `//player.bilibili.com/player.html?bvid=${bvid}&autoplay=${autoplay ? 1 : 0}&page=1&high_quality=1&as_wide=1`;
            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-video md-video-iframe', style: containerStyle } };
            node.children = [{
                type: 'html',
                value: `<div class="md-video-wrap"><iframe src="${iframeSrc}" frameborder="0" allowfullscreen scrolling="no" allow="fullscreen" title="${escapeHtml('Bilibili Video')}"></iframe></div>`
            }];
        } else if (youtube) {
            let iframeSrc = `https://www.youtube.com/embed/${youtube}?rel=0`;
            if (autoplay) iframeSrc += '&autoplay=1&mute=1';
            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-video md-video-iframe', style: containerStyle } };
            node.children = [{
                type: 'html',
                value: `<div class="md-video-wrap"><iframe src="${iframeSrc}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="${escapeHtml('YouTube Video')}"></iframe></div>`
            }];
        } else {
            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-video', style: containerStyle } };
            node.children = [{ type: 'html', value: '<p style="color:var(--text-secondary);font-size:0.875rem;">Please provide a src, bilibili, or youtube attribute</p>' }];
        }
    } else if (name === 'audio') {
        const src = attrs.src || '';
        const netease = attrs.netease || '';
        const voice = attrs.voice || '';
        const title = attrs.title || '';
        const artist = attrs.artist || '';
        const cover = attrs.cover || '';
        const duration = attrs.duration || '';
        const align = attrs.align || '';
        const width = attrs.width || '';
        const uid = `audio-${Math.random().toString(36).slice(2, 7)}`;

        let containerStyle = '';
        if (align) containerStyle += `--audio-align:${align};`;
        if (width) containerStyle += `--audio-width:${width};`;

        if (netease) {
            const neteaseMode = attrs.mode || 'mini';
            const isCard = neteaseMode === 'card';
            const iframeHeight = isCard ? 86 : 52;
            const iframeWidth = isCard ? 330 : 298;
            const playerHeight = isCard ? 66 : 32;
            const neteaseClass = isCard ? 'md-audio-netease md-audio-netease-card' : 'md-audio-netease';

            node.data = { hName: 'div', hProperties: { class: `md-directive md-directive-audio ${neteaseClass}`, 'data-netease': netease, 'data-title': title || 'Netease Music', 'data-artist': artist || '', ...(containerStyle ? { style: containerStyle } : {}) } };
            node.children = [{
                type: 'html',
                value: `<div class="md-audio-netease-wrap${isCard ? ' md-audio-netease-wrap-card' : ''}"><iframe src="//music.163.com/outchain/player?type=2&id=${netease}&auto=0&height=${playerHeight}" frameborder="no" border="0" marginwidth="0" marginheight="0" width="${iframeWidth}" height="${iframeHeight}" title="${escapeHtml(title || 'Netease Music')}"></iframe></div>`
            }];
        } else if (voice) {
            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-audio md-audio-voice', 'data-src': voice, 'data-duration': duration, ...(containerStyle ? { style: containerStyle } : {}) } };
            node.children = [{
                type: 'html',
                value: `<div class="md-audio-voice-player"><button type="button" class="md-voice-play" aria-label="Play"><span class="md-voice-icon-play">${getIconSvg('lucide:play', 14)}</span><span class="md-voice-icon-pause" style="display:none">${getIconSvg('lucide:pause', 14)}</span></button><canvas class="md-voice-wave" width="200" height="28"></canvas><span class="md-voice-duration">${duration ? duration + '"' : ''}</span></div>`
            }];
        } else if (src) {
            const playIcon = getIconSvg('lucide:play', 18);
            const pauseIcon = getIconSvg('lucide:pause', 18);
            const coverHtml = cover ? `<img src="${cover}" alt="${escapeHtml(title || 'Cover')}" loading="lazy" />` : `<div class="md-audio-cover-default">${getIconSvg('lucide:music', 18)}</div>`;
            const autoplayAttr = attrs.autoplay === 'true' || attrs.autoplay === '' ? ' autoplay' : '';

            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-audio', 'data-src': src, ...(containerStyle ? { style: containerStyle } : {}) } };
            node.children = [{
                type: 'html',
                value: `<div class="md-audio-player" id="${uid}"${autoplayAttr ? ' data-autoplay="1"' : ''}><div class="md-audio-cover">${coverHtml}</div><div class="md-audio-meta"><div class="md-audio-title">${escapeHtml(title || 'Unknown')}</div><div class="md-audio-artist">${escapeHtml(artist || '')}</div></div><button type="button" class="md-audio-btn" aria-label="Play"><span class="md-audio-play">${playIcon}</span><span class="md-audio-pause" style="display:none">${pauseIcon}</span></button><div class="md-audio-progress-wrap"><span class="md-audio-time-current">00:00</span><div class="md-audio-progress-bar"><div class="md-audio-progress-fill"></div></div><span class="md-audio-time-total">00:00</span></div><audio preload="metadata" style="display:none"${autoplayAttr}><source src="${src}" type="audio/mpeg"></audio></div>`
            }];
        } else {
            node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-audio', ...(containerStyle ? { style: containerStyle } : {}) } };
            node.children = [{ type: 'html', value: '<p style="color:var(--text-secondary);font-size:0.875rem;">Please provide a src, netease, or voice attribute</p>' }];
        }
    }
}
