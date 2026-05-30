/**
 * :::mind directive — Interactive mindmap using markmap.js
 *
 * Renders nested Markdown lists as interactive SVG mindmaps.
 */

import { serializeToHtml } from './shared.mjs';

let uidCounter = 0;
function generateUid() {
    return `mind-${Date.now()}-${++uidCounter}`;
}

function listToMarkdown(node, indent = 0) {
    if (!node || node.type !== 'list') return '';
    let md = '';
    const prefix = '  '.repeat(indent);
    for (const item of node.children || []) {
        if (item.type !== 'listItem') continue;
        let text = '';
        let childList = null;
        for (const child of item.children || []) {
            if (child.type === 'paragraph') {
                text = serializeToHtml(child.children).replace(/<[^>]+>/g, '');
            } else if (child.type === 'list') {
                childList = child;
            }
        }
        md += `${prefix}- ${text}\n`;
        if (childList) md += listToMarkdown(childList, indent + 1);
    }
    return md;
}

export function processMindDirective(node) {
    let listNode = null;
    for (const child of node.children || []) {
        if (child.type === 'list') { listNode = child; break; }
    }

    if (!listNode) {
        node.data = { hName: 'div', hProperties: {} };
        node.children = [{ type: 'html', value: '<div class="md-directive md-directive-mind"><p class="md-mind-empty">思维导图内容为空</p></div>' }];
        return;
    }

    const markdown = listToMarkdown(listNode).trim();
    const uid = generateUid();

    const html = `
<div class="md-directive md-directive-mind">
  <div class="markmap" id="${uid}" style="min-height: 300px;">
${markdown}
  </div>
</div>
<script>
(function() {
  if (window.__markmapObserver) return;

  function loadMarkmap() {
    if (window.__markmapAutoloaderLoaded) return;
    window.__markmapAutoloaderLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/markmap-autoloader@0.17.0';
    s.async = true;
    document.head.appendChild(s);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        loadMarkmap();
        observer.disconnect();
      }
    });
  }, { rootMargin: '200px' });

  observer.observe(document.getElementById('${uid}'));
  window.__markmapObserver = observer;
})();
</script>
`;

    node.data = { hName: 'div', hProperties: {} };
    node.children = [{ type: 'html', value: html }];
}
