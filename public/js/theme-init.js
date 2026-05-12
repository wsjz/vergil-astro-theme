/**
 * Theme Initialization
 *
 * Reads user's saved color scheme and dark mode preference from localStorage
 * and applies them before page render to avoid flash.
 */
(function() {
    try {
        const scheme = localStorage.getItem('colorScheme') || 'C';
        const isDark = localStorage.getItem('darkMode');
        document.documentElement.setAttribute('data-theme', scheme);
        if (isDark === 'true' || (isDark === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    } catch(e) {}
})();
