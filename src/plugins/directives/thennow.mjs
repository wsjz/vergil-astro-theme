import { getIconSvg, escapeHtml } from './shared.mjs';

function extractImages(children) {
    const images = [];
    for (const child of children || []) {
        if (child.type === 'image') {
            images.push(child);
        } else if (child.type === 'paragraph' && child.children) {
            for (const c of child.children) {
                if (c.type === 'image') images.push(c);
            }
        }
    }
    return images;
}

function makeId(images, beforeLabel, afterLabel) {
    const key = images.map(img => img.url || '').join('|') + '|' + beforeLabel + '|' + afterLabel;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = ((hash << 5) - hash) + key.charCodeAt(i);
        hash |= 0;
    }
    return 'thennow-' + Math.abs(hash).toString(36) + '-' + Math.floor(Math.random() * 100000);
}

export function processThennowDirective(node) {
    const attrs = node.attributes || {};
    const beforeLabel = attrs.before || 'Before';
    const afterLabel = attrs.after || 'After';
    const images = extractImages(node.children);

    if (images.length < 2) {
        node.data = { hName: 'div', hProperties: { class: 'md-directive md-directive-thennow md-thennow-fallback' } };
        node.children = [
            { type: 'html', value: `<p style="color:var(--text-secondary);font-size:0.875rem;">:::thennow 需要两张图片，当前仅找到 ${images.length} 张。</p>` }
        ];
        return;
    }

    const beforeImg = images[0];
    const afterImg = images[1];
    const uid = makeId([beforeImg, afterImg], beforeLabel, afterLabel);

    const arrowsIcon = getIconSvg('lucide:chevrons-left-right', 20);

    const html = `
<div class="md-directive md-directive-thennow">
  <div class="thennow-container" id="${uid}" style="--split:50%;" data-thennow="true">
    <div class="thennow-layer thennow-before">
      <img src="${escapeHtml(beforeImg.url || '')}" alt="${escapeHtml(beforeImg.alt || beforeLabel)}" loading="lazy">
    </div>
    <div class="thennow-layer thennow-after" style="clip-path:inset(0 0 0 var(--split));">
      <img src="${escapeHtml(afterImg.url || '')}" alt="${escapeHtml(afterImg.alt || afterLabel)}" loading="lazy">
    </div>
    <span class="thennow-label thennow-label-before">${escapeHtml(beforeLabel)}</span>
    <span class="thennow-label thennow-label-after">${escapeHtml(afterLabel)}</span>
    <div class="thennow-slider" role="slider" aria-label="图片对比滑块" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
      <div class="thennow-track"></div>
      <div class="thennow-handle">${arrowsIcon}</div>
    </div>
  </div>
</div>
<script>
(function(){
  var container = document.getElementById('${uid}');
  if (!container) return;
  if (container.dataset.thennowReady) return;
  container.dataset.thennowReady = 'true';

  var slider = container.querySelector('.thennow-slider');
  var afterLayer = container.querySelector('.thennow-after');
  if (!slider || !afterLayer) return;

  var isDragging = false;

  function setSplit(pct) {
    pct = Math.max(0, Math.min(100, pct));
    container.style.setProperty('--split', pct + '%');
    afterLayer.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
    slider.setAttribute('aria-valuenow', Math.round(pct));
  }

  function updateFromEvent(e) {
    var rect = container.getBoundingClientRect();
    var clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
    var pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(pct);
  }

  slider.addEventListener('pointerdown', function(e) {
    isDragging = true;
    container.classList.add('is-dragging');
    slider.setPointerCapture(e.pointerId);
    updateFromEvent(e);
  });

  slider.addEventListener('pointermove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    updateFromEvent(e);
  });

  function endDrag(e) {
    isDragging = false;
    container.classList.remove('is-dragging');
    slider.releasePointerCapture(e.pointerId);
  }

  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);

  slider.addEventListener('keydown', function(e) {
    var current = parseFloat(container.style.getPropertyValue('--split')) || 50;
    switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        setSplit(current - 5);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        setSplit(current + 5);
        break;
      case 'Home':
        e.preventDefault();
        setSplit(0);
        break;
      case 'End':
        e.preventDefault();
        setSplit(100);
        break;
    }
  });
})();
</script>`;

    node.data = { hName: 'div', hProperties: {} };
    node.children = [{ type: 'html', value: html }];
}
