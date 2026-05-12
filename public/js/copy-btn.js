/**
 * Copy Button Handler
 *
 * Adds click-to-copy functionality for .md-copy-btn elements.
 */
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.md-copy-btn');
    if (!btn) return;
    let input = btn.parentElement.querySelector('.md-copy-input');
    if (!input && btn.dataset.copyTarget) {
        input = document.getElementById(btn.dataset.copyTarget);
    }
    if (!input) return;
    navigator.clipboard.writeText(input.value).then(function() {
        const original = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>';
        btn.classList.add('md-copy-success');
        setTimeout(function() {
            btn.innerHTML = original;
            btn.classList.remove('md-copy-success');
        }, 1500);
    });
});
