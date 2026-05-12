import { getIconSvg, encryptPrivateContent, serializeToHtml, escapeHtml } from './shared.mjs';

export function processPrivateDirective(node) {
    const attrs = node.attributes || {};
    const password = attrs.password || '';
    const hint = attrs.hint || '';

    if (!password) {
        node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-private' } };
        node.children = [{ type: 'html', value: '<p style="color:var(--text-secondary);font-size:0.875rem;">Please provide a password attribute, e.g. :::private{password="xxx"}</p>' }];
    } else {
        const html = serializeToHtml(node.children);
        const encrypted = encryptPrivateContent(html, password);

        const lockIcon = getIconSvg('lucide:lock', 20);
        const unlockIcon = getIconSvg('lucide:lock-open', 20);
        const eyeOpenIcon = getIconSvg('lucide:eye', 16);
        const eyeCloseIcon = getIconSvg('lucide:eye-off', 16);

        const hintHtml = hint ? `<div class="md-private-hint">Hint: ${escapeHtml(hint)}</div>` : '';

        node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-private', 'data-payload': encrypted } };
        node.children = [{
            type: 'html',
            value: `<div class="md-private-locked"><div class="md-private-icon">${lockIcon}</div><div class="md-private-title">Private Content</div><div class="md-private-desc">This content is encrypted, please enter the password to view</div>${hintHtml}<div class="md-private-form"><div class="md-private-input-wrap"><input type="password" class="md-private-input" placeholder="Enter password" /><button type="button" class="md-private-toggle" aria-label="Show password"><span class="md-private-eye-open">${eyeOpenIcon}</span><span class="md-private-eye-close">${eyeCloseIcon}</span></button></div><button type="button" class="md-private-btn">View</button></div><div class="md-private-error">Incorrect password, please try again</div></div><div class="md-private-unlocked" style="display:none"><div class="md-private-header"><span class="md-private-status">${unlockIcon}<span>Unlocked</span></span><button type="button" class="md-private-lock-btn">${lockIcon}<span>Lock again</span></button></div><div class="md-private-content"></div></div>`
        }];
    }
}
