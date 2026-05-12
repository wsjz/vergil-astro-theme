/**
 * Search Hotkey
 *
 * Opens search modal on Cmd/Ctrl+K.
 */
(function() {
    document.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            var searchToggle = document.querySelector('[data-search-toggle]');
            if (searchToggle) searchToggle.click();
        }
    });
})();
