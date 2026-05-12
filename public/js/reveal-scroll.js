/**
 * Scroll Reveal Animation
 *
 * Uses IntersectionObserver to add 'visible' class to .reveal elements.
 */
(function() {
    function initReveal() {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -40px 0px',
            threshold: 0
        });
        document.querySelectorAll('.reveal').forEach(function(el) {
            observer.observe(el);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReveal);
    } else {
        initReveal();
    }
    document.addEventListener('astro:page-load', initReveal);
})();
